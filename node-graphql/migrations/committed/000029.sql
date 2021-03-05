--! Previous: sha1:ada61702be66a15408c74ec84d6bead9afe845b5
--! Hash: sha1:ae832932cd02c70b7d4aa93283a3846921f6a1d0

-- Enter migration here
DROP FUNCTION IF EXISTS register;
-- Registers a single user and creates an account.
CREATE OR REPLACE FUNCTION register(
    first_name text,
    last_name text,
    email text,
    password text,
    "role" int = 3,
    phone text = '',
    dob text = '',
    status text = 'pending'
) returns users as $$
DECLARE
registered_user bigint;
person users;
password_hash text;
BEGIN
    SELECT INTO registered_user id FROM users WHERE users.email = register.email;
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

-- End: Authindacation functions

DROP FUNCTION IF EXISTS blukDelete;
DROP FUNCTION IF EXISTS multipleDelete;
-- Multiple delete
CREATE OR REPLACE FUNCTION multipleDelete(id_vals int[], table_name text) RETURNS VOID AS $$
    DECLARE
    item INT;
    BEGIN
        FOREACH item IN ARRAY id_vals
        LOOP
            EXECUTE format('DELETE FROM %I WHERE id = %s', table_name, item);  
        END LOOP;
    END;
$$ language plpgsql;
-- END Multiple delete
