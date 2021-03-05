--! Previous: sha1:002673de1410830923a02a7b746f98f80f800b11
--! Hash: sha1:c8b52dae1da4090da898896dce3115e87fd368a9

-- Enter migration here
DROP FUNCTION IF EXISTS register;
-- Registers a single user and creates an account.
CREATE OR REPLACE FUNCTION register(
    first_name text,
    last_name text,
    email text,
    password text,
    "role" int = 2,
    phone text = '',
    dob text = '',
    status text = 'pending'
) returns users as $$
DECLARE
registered_user bigint;
person users;
password_hash text;
BEGIN
    SELECT INTO registered_user id FROM users WHERE users.email = register.email AND deleted_at IS NULL;
    IF registered_user IS NOT NULL THEN
        RAISE EXCEPTION 'Email is already registered. Please use another or try forgot password.';
        RETURN null;
    END IF;

    IF role = 1 THEN
        INSERT INTO users (first_name, last_name, email, status, email_verified_at, phone) VALUES (first_name, last_name, email, status, CURRENT_TIMESTAMP, phone) RETURNING * INTO person;
    ELSE
        INSERT INTO users (first_name, last_name, email, status, phone) VALUES (first_name, last_name, email, status, phone) RETURNING * INTO person;
    END IF;

    INSERT INTO private.users (user_id, password) VALUES (person.id, password);
    INSERT INTO role_user (user_id, role_id) VALUES (  person.id, role ) ON CONFLICT DO NOTHING;
    RETURN person;
END;
$$ language plpgsql strict security definer;


CREATE OR REPLACE FUNCTION authenticate( email text, password text ) returns jwt_token as $$
DECLARE
    public_user public.users;
    current_user_id integer;
    found_user private.users;
BEGIN
    SELECT INTO public_user * FROM users WHERE users.email = authenticate.email AND deleted_at IS NULL;
    
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

--Remove unique email from users table
--ALTER TABLE users DROP CONSTRAINT users_email_unique_constraint;
