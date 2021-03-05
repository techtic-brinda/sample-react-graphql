--! Previous: sha1:67b10446a8bc47d648184e5be5669345b59d9aa5
--! Hash: sha1:ea5b68f81fb8120b15635a84b55a289e1477d155

-- Enter migration here

-- authenticate change message for invalid password.
CREATE OR REPLACE FUNCTION authenticate( email text, password text ) returns jwt_token as $$
DECLARE
    public_user public.users;
    current_user_id integer;
    found_user private.users;
BEGIN
    SELECT INTO public_user * FROM users WHERE users.email = authenticate.email;
    
    IF public_user IS NULL THEN
    RAISE EXCEPTION '"The email account that you tried to reach" does not exist.';
    END IF;

    SELECT INTO found_user * FROM private.users where user_id = public_user.id;
    IF crypt(authenticate.password, found_user.password_hash) = found_user.password THEN
    
        IF public_user.deleted_at IS NOT NULL THEN
        RAISE EXCEPTION '"The email account that you tried to reach" does not exist.';
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
-- end authenticate change message for invalid password.


CREATE OR REPLACE FUNCTION generate_users_random_password_hash() returns TRIGGER as $$
    BEGIN
      NEW.password_hash = gen_salt('bf', 4);
      NEW.password = crypt(NEW.password, NEW.password_hash);
      return NEW;
    END;
  $$ language plpgsql;

  DROP TRIGGER IF EXISTS generate_users_random_password_hash  ON private.users;
  CREATE TRIGGER generate_users_random_password_hash BEFORE INSERT ON private.users FOR EACH ROW EXECUTE PROCEDURE generate_users_random_password_hash();

-- Change password hash string to 16 character to 40 character.
DROP FUNCTION IF EXISTS change_password;

CREATE OR REPLACE FUNCTION change_password(
    old_password text,
    new_password text
) returns boolean as $$
DECLARE
    has_password text;
    new_password_hash text;
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
        new_password_hash := crypt(new_password, gen_salt('bf', 4));
        has_password := crypt(new_password, new_password_hash);
        UPDATE private.users SET password = has_password, password_hash = new_password_hash where user_id = current_user_id();
        return true;
    ELSE
        RAISE EXCEPTION 'The old password you have entered is incorrect.';
        return false;
    END IF;
END;
$$ language plpgsql strict security definer;

--Alter password has column
ALTER TABLE private.users
    ALTER COLUMN password_hash TYPE text;
