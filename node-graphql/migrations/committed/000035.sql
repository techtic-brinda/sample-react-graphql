--! Previous: sha1:b405b1a48ccd3dab0c236afdf20a686bd55df69e
--! Hash: sha1:99c52e835e1c73baaf689e3f52d93bb01a158423

-- Enter migration here
-- Craete Jwt token using email and password
  CREATE OR REPLACE FUNCTION authenticate( email text, password text ) returns jwt_token as $$
    DECLARE
      public_user public.users;
      current_user_id integer;
      found_user private.users;
    BEGIN
      SELECT INTO public_user * FROM users WHERE users.email = authenticate.email;
     
      IF public_user IS NULL THEN
        RAISE EXCEPTION 'The entered email and password are invalid.';
      END IF;

      

      SELECT INTO found_user * FROM private.users where user_id = public_user.id;
      IF crypt(authenticate.password, found_user.password_hash) = found_user.password THEN
        
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
