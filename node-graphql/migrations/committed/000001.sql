--! Previous: -
--! Hash: sha1:fcd0dd5dab9724a7f4f62d71bf375f04285f5e20

-- Enter migration here

-- CREATE IF NOT pgcrypto is EXISTS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE SCHEMA IF NOT EXISTS private;

SET statement_timeout = 10000;


-- Create slugify function
  CREATE EXTENSION IF NOT EXISTS "unaccent";

  -- Create function for generate random string
  CREATE OR REPLACE FUNCTION random_string(length integer) returns text as $$
    declare
      chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
      result text := '';
      i integer := 0;
    begin
      if length < 0 then
        raise exception 'Given length can not be less than 0';
      end if;
      for i in 1..length loop
        result := result || chars[1+random()*(array_length(chars, 1)-1)];
      end loop;
      return result;
    end;
  $$ language plpgsql;
  -- End: Create function for generate random string

  DROP FUNCTION IF EXISTS slugify;
  CREATE OR REPLACE FUNCTION text_to_slug("value" TEXT)
  RETURNS TEXT AS $$
    -- removes accents (diacritic signs) from a given string --
    WITH "unaccented" AS (
      SELECT unaccent("value") AS "value"
    ),
    -- lowercases the string
    "lowercase" AS (
      SELECT lower("value") AS "value"
      FROM "unaccented"
    ),
    -- remove single and double quotes
    "removed_quotes" AS (
      SELECT regexp_replace("value", '[''"]+', '', 'gi') AS "value"
      FROM "lowercase"
    ),
    -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
    "hyphenated" AS (
      SELECT regexp_replace("value", '[^a-z0-9\\-_]+', '-', 'gi') AS "value"
      FROM "removed_quotes"
    ),
    -- trims hyphens('-') if they exist on the head or tail of the string
    "trimmed" AS (
      SELECT regexp_replace(regexp_replace("value", '\-+$', ''), '^\-', '') AS "value"
      FROM "hyphenated"
    )
    SELECT "value" FROM "trimmed";
  $$ LANGUAGE SQL STRICT IMMUTABLE;

  CREATE OR REPLACE FUNCTION slugify("value" TEXT, table_name TEXT, column_name TEXT DEFAULT 'slug') RETURNS TEXT LANGUAGE plpgsql AS $$
    DECLARE
      done boolean := false;
      _index integer := 1;
      new_slug TEXT;
      temp_slug TEXT;
      sql TEXT;
    BEGIN
      LOOP
        IF _index > 1 THEN
          new_slug := text_to_slug("value" || '-' || _index);
        ELSE
          new_slug := text_to_slug("value");
        END IF;
        sql := 'SELECT false FROM %s WHERE %s = '||quote_literal('%s');
        EXECUTE format(sql, table_name, column_name, new_slug) INTO done;
        _index := _index + 1;
        EXIT WHEN (done = true) OR (done is null);
      END LOOP;

      RETURN new_slug;
  END;
  $$;
-- End: Create slugify function


-- Create users table
  CREATE SEQUENCE IF NOT EXISTS users_id_seq;
  CREATE TABLE IF NOT EXISTS  users
  (
      id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
      first_name character varying(50) NOT NULL,
      last_name character varying(50) NOT NULL,
      slug character varying(50) NULL,
      email character varying(50) NOT NULL,
      phone character varying(20),
      dob timestamp,
      image character varying(255),
      status character varying(20) NOT NULL DEFAULT 'pending',
      email_verified_at timestamp,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT users_pkey PRIMARY KEY (id),
      CONSTRAINT users_email_unique_constraint UNIQUE (email)
  )
  TABLESPACE pg_default;

  CREATE OR REPLACE FUNCTION set_slug_in_users() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
  BEGIN
    NEW.slug := slugify(NEW.first_name || ' ' || NEW.last_name, 'users');
    RETURN NEW;
  END
  $$;

  DROP TRIGGER IF EXISTS insert_slug ON users;
  CREATE TRIGGER insert_slug BEFORE INSERT ON users FOR EACH ROW
    WHEN (NEW.first_name IS NOT NULL AND NEW.slug IS NULL)
  EXECUTE PROCEDURE set_slug_in_users();

  INSERT INTO users  (id, first_name, last_name, slug, email, phone, dob, image, status, email_verified_at) VALUES 
  (1, 'Admin', 'User', 'admin-user', 'admin@gmail.com', null, null, null, 'pending', null),
  (2, 'Angel', 'User', 'angel-user', 'angel@gmail.com', null, null, null, 'pending', null),
  (3, 'Champion', 'User', 'champion-user', 'champion@gmail.com', null, null, null, 'pending', null)
  ON CONFLICT DO NOTHING;

-- End: Create users table


-- Create private users table
  CREATE SEQUENCE IF NOT EXISTS private.users_id_seq;
  CREATE TABLE IF NOT EXISTS  private.users
  (
      id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
      user_id bigint NOT NULL ,
      password character varying(200) NOT NULL,
      password_hash character varying(50) NOT NULL,
      forgot_password_token character varying(50),
      email_verify_token character varying(50),
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT private_users_pkey PRIMARY KEY (id)
  )
  TABLESPACE pg_default;

  -- Make chagnes for password_hash column in users table 
  CREATE OR REPLACE FUNCTION generate_users_random_password_hash() returns TRIGGER as $$
    BEGIN
      NEW.password_hash = random_string(16);
      NEW.password = crypt(NEW.password, NEW.password_hash);
      return NEW;
    END;
  $$ language plpgsql;

  DROP TRIGGER IF EXISTS generate_users_random_password_hash  ON private.users;
  CREATE TRIGGER generate_users_random_password_hash BEFORE INSERT ON private.users FOR EACH ROW EXECUTE PROCEDURE generate_users_random_password_hash();

  INSERT INTO private.users  (id, user_id, password, password_hash, forgot_password_token, email_verify_token) VALUES 
  ( 1, 1, 'bWEieiLUB4lCc', 'bWtn9Vwxh4wbn75k', null, null),
  ( 2, 2, '49Qc7V81GE7Nc', '49w1o53lJaCYy2FA', null, null),
  ( 3, 3, 'BSsdhsfb3KFvw', 'BS9ZmZYTqPC3YSo8', null, null) ON CONFLICT DO NOTHING;

-- End: Create private users table


-- Create roles table
CREATE SEQUENCE IF NOT EXISTS roles_id_seq;
CREATE TABLE IF NOT EXISTS roles
(
    id bigint NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
    name character varying(50),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT roles_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

INSERT INTO roles (id, name) VALUES 
  ( 1, 'Admin'),
  ( 2, 'Angel'),
  ( 3, 'Champion') ON CONFLICT DO NOTHING;
-- End: Create roles table


-- Create role_user table
CREATE SEQUENCE IF NOT EXISTS role_user_id_seq;
CREATE TABLE IF NOT EXISTS role_user
(
    id bigint NOT NULL DEFAULT nextval('role_user_id_seq'::regclass),
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT role_user_pkey PRIMARY KEY (id),
    CONSTRAINT role_user_users_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT role_user_roles_fkey FOREIGN KEY (role_id)
        REFERENCES roles (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;
COMMENT ON TABLE role_user IS E'@omit manyToMany';


INSERT INTO role_user (id, user_id, role_id) VALUES 
  ( 1, 1, 1),
  ( 2, 2, 2),
  ( 3, 3, 3) ON CONFLICT DO NOTHING;
-- End: Create role_user table


-- Create permissions table
CREATE SEQUENCE IF NOT EXISTS permissions_id_seq;
CREATE TABLE IF NOT EXISTS private.permissions
(
    id bigint NOT NULL DEFAULT nextval('permissions_id_seq'::regclass),
    name character varying(50),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT permissions_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;
-- End: Create permissions table


-- Create permission_role table
CREATE SEQUENCE IF NOT EXISTS permission_role_id_seq;
CREATE TABLE IF NOT EXISTS private.permission_role
(
    id bigint NOT NULL DEFAULT nextval('permission_role_id_seq'::regclass),
    permission_id bigint NOT NULL,
    role_id bigint NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT permission_role_pkey PRIMARY KEY (id),
    CONSTRAINT permission_role_permissions_fkey FOREIGN KEY (permission_id)
        REFERENCES private.permissions (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT permission_role_roles_fkey FOREIGN KEY (role_id)
        REFERENCES roles (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;
COMMENT ON TABLE private.permission_role IS E'@omit manyToMany';
-- End: Create permission_role table


-- Authindacation functions
  
  -- Create custom type for jwt_token
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'jwt_token') THEN
      CREATE TYPE jwt_token AS (
        role text,
        exp integer,
        user_id integer,
        is_admin boolean,
        username varchar
      );
    END IF;
  END$$;

  -- Craete Jwt token using email and password
  CREATE OR REPLACE FUNCTION authenticate( email text, password text ) returns jwt_token as $$
    DECLARE
      public_user public.users;
      current_user_id integer;
      found_user private.users;
    BEGIN
      SELECT INTO public_user * FROM users WHERE users.email = authenticate.email;
     
      IF public_user IS NULL THEN
        RAISE EXCEPTION 'Email or Password is worong';
      END IF;

      SELECT INTO found_user * FROM private.users where user_id = public_user.id;
      IF crypt(authenticate.password, found_user.password_hash) = found_user.password THEN
          return ( 'user', extract(epoch from now() + interval '30 days'), public_user.id, false, public_user.email )::jwt_token;
      ELSE
        RAISE EXCEPTION 'Email or Password is worong';
        return null;
      END IF;
    END;
  $$ language plpgsql STRICT SECURITY DEFINER;

  -- Craete function for get current user id
  CREATE OR REPLACE FUNCTION current_user_id() RETURNS integer AS $$
    select nullif(current_setting('jwt.claims.user_id', true), '')::integer;
  $$ language sql STABLE; 

  -- Craete function for get current user info
  CREATE OR REPLACE FUNCTION current_user_info() RETURNS users AS $$
    SELECT users FROM users WHERE id = current_user_id();
  $$ LANGUAGE SQL STABLE;

  -- Registers a single user and creates an account.
  CREATE OR REPLACE FUNCTION register(
    first_name text,
    last_name text,
    email text,
    password text,
    phone text = '',
    dob text = ''
  ) returns users as $$
  DECLARE
    person users;
    password_hash text;
  BEGIN
      INSERT INTO users (first_name, last_name, email) VALUES (first_name, last_name, email) RETURNING * INTO person;
      INSERT INTO private.users (user_id, password) VALUES (person.id, password);
      RETURN person;
  END;
  $$ language plpgsql strict security definer;

-- End: Authindacation functions
