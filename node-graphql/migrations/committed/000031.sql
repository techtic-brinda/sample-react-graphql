--! Previous: sha1:48056e26843500fe336f8f764140aadd8e1a27c3
--! Hash: sha1:f462a990d5e3eea98916bc442cb881a7255c5eb4

-- Enter migration here
DROP FUNCTION IF EXISTS verify_account;
-- Registers a single user and creates an account.
CREATE OR REPLACE FUNCTION verify_account(
    token text
) returns boolean as $$
DECLARE
    private_person private.users;
BEGIN
    SELECT INTO private_person * FROM private.users WHERE email_verify_token = token;
    IF private_person IS NULL THEN
        RAISE EXCEPTION 'Something went wrong. Please try again later.';
        RETURN false;
    END IF;
        UPDATE private.users SET email_verify_token = '' where id = private_person.id;
        UPDATE public.users SET email_verified_at = NOW(), status = 'active' where id = private_person.user_id;
        return true;
END;
$$ language plpgsql strict security definer;
-- Enter migration here
