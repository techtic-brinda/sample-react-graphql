--! Previous: sha1:d298b7fdbc0904386477d8c7d4cd650c19678820
--! Hash: sha1:af1cb8bf073fd79350ac50a0d9900f4887b20ea5

-- Enter migration here

ALTER TABLE private.users
    ALTER COLUMN email_verify_token TYPE character varying (240);


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
        
        IF public_user.email_verified_at IS NULL THEN
            RAISE EXCEPTION 'Please verify your email.';
        ELSE
          return ( 'user', extract(epoch from now() + interval '30 days'), public_user.id, false, public_user.email )::jwt_token;
        END IF;
      ELSE
        RAISE EXCEPTION 'Email or Password is worong';
        return null;
      END IF;
    END;
  $$ language plpgsql STRICT SECURITY DEFINER;
