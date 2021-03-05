--! Previous: sha1:132a1b99eb7bba8f68b7bed850742420ba9bfcf3
--! Hash: sha1:0265953fe275db5104bc0f890e36b96d225bbfb9

-- Enter migration here

 -- Create custom type for jwt_token
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sponser_list') THEN
      CREATE TYPE sponser_list AS (
        id bigint
      );
    END IF;
END$$;

DROP FUNCTION IF EXISTS get_sponsers;
-- Registers a single user and creates an account.
CREATE OR REPLACE FUNCTION get_sponsers() returns sponser_list as $$
 DECLARE
  public_user public.users;
BEGIN
    SELECT INTO public_user * FROM public.users WHERE id in (SELECT user_id FROM role_user WHERE role_id = 2);
    return (public_user.id)::sponser_list;
END

  $$ language plpgsql ;


  
CREATE SEQUENCE IF NOT EXISTS mail_templates_id_seq;
CREATE TABLE IF NOT EXISTS mail_templates
(
 id         bigint NOT NULL DEFAULT nextval('mail_templates_id_seq'::regclass),
 title      varchar(500) NOT NULL,
 slug       varchar(500) NULL,
 "content"   text NULL,
 created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 deleted_at timestamp NULL,
 CONSTRAINT mail_templates_pkey PRIMARY KEY ( id )
);
