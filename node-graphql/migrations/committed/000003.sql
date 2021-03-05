--! Previous: sha1:ac5e4189ba51bd558b91a950fd7abeeb56d0171e
--! Hash: sha1:afbd7047fe7bf7b317688b96c728d05b4283c08c

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
    dob text = ''
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

    INSERT INTO users (first_name, last_name, email) VALUES (first_name, last_name, email) RETURNING * INTO person;
    INSERT INTO private.users (user_id, password) VALUES (person.id, password);
  
    INSERT INTO role_user (user_id, role_id) VALUES (  person.id, role ) ON CONFLICT DO NOTHING;
    RETURN person;
END;
$$ language plpgsql strict security definer;

-- End: Authindacation functions

DROP TABLE IF EXISTS pages;
CREATE SEQUENCE IF NOT EXISTS pages_id_seq;
CREATE TABLE IF NOT EXISTS pages
(
    id bigint NOT NULL DEFAULT nextval('pages_id_seq'::regclass),
    title character varying(500) NOT NULL,
    slug character varying(500) NOT NULL,
    "content" text,
    meta_title character varying(150),
    meta_description character varying(500),
    meta_keywords character varying(500),
    status character varying(50) DEFAULT 'published',
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pages_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;


INSERT INTO pages  (id, title, slug, "content") VALUES 
(1, 'Terms and conditions', 'terms-and-conditions', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
(2, 'About Us', 'about-us', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).')
ON CONFLICT DO NOTHING;



ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS status character varying(50);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS status character varying(50);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_title character varying(50);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description character varying(50);
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_keywords character varying(50);

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
        RAISE EXCEPTION 'Your old password is worong';
        return false;
    END IF;
END;
$$ language plpgsql strict security definer;
