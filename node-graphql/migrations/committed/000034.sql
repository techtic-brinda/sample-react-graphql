--! Previous: sha1:3822853ad83941d2ee5e6ac79e40987b7474f5b7
--! Hash: sha1:b405b1a48ccd3dab0c236afdf20a686bd55df69e

-- Enter migration here
DROP FUNCTION IF EXISTS change_password;
-- Registers a single user and creates an account.
CREATE OR REPLACE FUNCTION change_password(
    old_password text,
    new_password text
) returns boolean as $$
DECLARE
    has_password text;
    person users;
    private_person private.users;
BEGIN
    SELECT INTO person * FROM users WHERE id = current_user_id();
    SELECT INTO private_person * FROM private.users WHERE user_id = current_user_id();
    IF person IS NULL THEN
        RAISE EXCEPTION 'You are not authorised to change password.';
        RETURN false;
    END IF;
    IF crypt(old_password, private_person.password_hash) = private_person.password THEN
        has_password := crypt(new_password, private_person.password_hash);
        UPDATE private.users SET password = has_password where user_id = current_user_id();
        return true;
    ELSE
        RAISE EXCEPTION 'The old password you have entered is incorrect.';
        return false;
    END IF;
END;
$$ language plpgsql strict security definer;
