--! Previous: sha1:1d8c662615ecc4a5c484efd257e17cf2c4f7b13b
--! Hash: sha1:132a1b99eb7bba8f68b7bed850742420ba9bfcf3

-- Enter migration here

DROP FUNCTION IF EXISTS forgot_password_user;
-- Registers a single user and creates an account.
CREATE OR REPLACE FUNCTION forgot_password_user(
    token text
) returns users as $$
DECLARE
    private_person private.users;
    public_person public.users;
BEGIN
    SELECT INTO private_person * FROM private.users WHERE forgot_password_token = token;
    IF private_person IS NULL THEN
        RAISE EXCEPTION 'Something went wrong. Please try again later.';
        RETURN false;
    END IF;
        SELECT INTO public_person * FROM public.users WHERE id = private_person.user_id;
        return public_person;
END;
$$ language plpgsql strict security definer;

DROP FUNCTION IF EXISTS reset_password;
-- Registers a single user and creates an account.
CREATE OR REPLACE FUNCTION reset_password(
    user_in_id bigint,
    new_password text
) returns boolean as $$
DECLARE
    has_password text;
    person users;
    private_person private.users;
BEGIN
    SELECT INTO person * FROM users WHERE id = user_in_id;
    SELECT INTO private_person * FROM private.users WHERE user_id = user_in_id;
    IF person IS NULL THEN
        RAISE EXCEPTION 'You are not authorised to change password.';
        RETURN false;
    END IF;
    
        has_password := crypt(new_password, private_person.password_hash);
        UPDATE private.users SET password = has_password, forgot_password_token = null where user_id = user_in_id;
        return true;
END;
$$ language plpgsql strict security definer;
