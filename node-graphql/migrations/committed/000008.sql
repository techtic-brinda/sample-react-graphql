--! Previous: sha1:0031f1301dabc6401d853756aaf459c5aab3ae7b
--! Hash: sha1:0e8d1e6c65f10c5d6656685f58092de5b656ced2

-- Enter migration here
-- Start: Create donation categories table

  CREATE SEQUENCE IF NOT EXISTS donation_categories_id_seq;
  CREATE TABLE IF NOT EXISTS donation_categories
  (
      id bigint NOT NULL DEFAULT nextval('donation_categories_id_seq'::regclass),
      name character varying(500) NOT NULL,
      slug character varying(500) NULL,
      status character varying(50),
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      deleted_at timestamp with time zone DEFAULT NULL,
      CONSTRAINT donation_categories_pkey PRIMARY KEY (id)
  );

  CREATE OR REPLACE FUNCTION set_slug_in_donation_categories() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
  BEGIN
    NEW.slug := slugify(NEW.name, 'donation_categories');
    RETURN NEW;
  END
  $$;

  DROP TRIGGER IF EXISTS insert_slug ON donation_categories;
  CREATE TRIGGER insert_slug BEFORE INSERT ON donation_categories FOR EACH ROW
    WHEN (NEW.name IS NOT NULL AND NEW.slug IS NULL)
  EXECUTE PROCEDURE set_slug_in_donation_categories();

-- end donation categories table
