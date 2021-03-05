--! Previous: sha1:fc358bf5f6cdb3e5c4d9978dea6397e6d12eb9f4
--! Hash: sha1:4db3f410e21e1160a2ad183eb2a0e0d614161087

-- Enter migration here
   CREATE OR REPLACE FUNCTION current_user_info() RETURNS users AS $$
    SELECT users FROM users WHERE id = (select nullif(current_setting('jwt.claims.user_id', true), '')::integer);
  $$ LANGUAGE SQL STABLE;
