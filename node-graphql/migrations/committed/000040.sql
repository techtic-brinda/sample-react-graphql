--! Previous: sha1:c8b52dae1da4090da898896dce3115e87fd368a9
--! Hash: sha1:67b10446a8bc47d648184e5be5669345b59d9aa5

-- Enter migration here

-- authenticate change deletet user message.
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
    
        IF public_user.deleted_at IS NOT NULL THEN
        RAISE EXCEPTION 'The email account that you tried to reach" does not exist.';
        END IF;
        
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
-- end authenticate change deletet user message.
