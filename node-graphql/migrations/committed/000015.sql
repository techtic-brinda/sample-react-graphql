--! Previous: sha1:bea63e1c7c1016d177ea4f0df94da4e88abe54d6
--! Hash: sha1:d298b7fdbc0904386477d8c7d4cd650c19678820

-- Enter migration here
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
        UPDATE private.users SET password = has_password where user_id = user_in_id;
        return true;
END;
$$ language plpgsql strict security definer;
