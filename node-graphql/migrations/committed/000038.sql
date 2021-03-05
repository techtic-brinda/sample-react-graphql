--! Previous: sha1:834f4560a2aad7df1f6c35730154a4c071f9ef5d
--! Hash: sha1:002673de1410830923a02a7b746f98f80f800b11

-- Enter migration here
ALTER TABLE blogs
    ALTER COLUMN status SET DEFAULT 'published';

CREATE OR REPLACE FUNCTION authenticate( email text, password text ) returns jwt_token as $$
DECLARE
    public_user public.users;
    current_user_id integer;
    found_user private.users;
BEGIN
    SELECT INTO public_user * FROM users WHERE users.email = authenticate.email;
    
    IF public_user IS NULL THEN
    RAISE EXCEPTION 'The entered email and password are invalid.';
    END IF;

    SELECT INTO found_user * FROM private.users where user_id = public_user.id;
    IF crypt(authenticate.password, found_user.password_hash) = found_user.password THEN
    
    IF public_user.status != 'active' THEN
    RAISE EXCEPTION 'Unable to login. Please contact your Administrator';
    END IF;

    IF public_user.email_verified_at IS NULL THEN
        RAISE EXCEPTION 'Please verify your email.';
    ELSE
        return ( 'user', extract(epoch from now() + interval '30 days'), public_user.id, false, public_user.email )::jwt_token;
    END IF;
    ELSE
    RAISE EXCEPTION 'The entered email and password are invalid.';
    return null;
    END IF;
END;
$$ language plpgsql STRICT SECURITY DEFINER;

-- Added soft delete
ALTER TABLE orphans ADD COLUMN IF NOT EXISTS deleted_at timestamp DEFAULT null;
ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS deleted_at timestamp DEFAULT null;
ALTER TABLE institutions ADD COLUMN IF NOT EXISTS deleted_at timestamp DEFAULT null;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at timestamp DEFAULT null;
