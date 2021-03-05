--! Previous: sha1:4db3f410e21e1160a2ad183eb2a0e0d614161087
--! Hash: sha1:1d8c662615ecc4a5c484efd257e17cf2c4f7b13b

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
