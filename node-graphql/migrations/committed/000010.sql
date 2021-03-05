--! Previous: sha1:f34319e9669d204b2931a0d62b999df3ee3f1ab2
--! Hash: sha1:c82e7271ac8dc3e0b327393487ff2f6b56f2e4d8

-- Enter migration here

--Added slug trigger for mail_templates  setings
CREATE OR REPLACE FUNCTION set_slug_in_mail_templates() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
  BEGIN
    NEW.slug := slugify(NEW.title, 'mail_templates');
    RETURN NEW;
  END
  $$;

  DROP TRIGGER IF EXISTS insert_slug_mail ON mail_templates;
  CREATE TRIGGER insert_slug_mail BEFORE INSERT ON mail_templates FOR EACH ROW
    WHEN (NEW.title IS NOT NULL AND NEW.slug IS NULL)
  EXECUTE PROCEDURE set_slug_in_mail_templates();

  ALTER TABLE mail_templates
    ADD COLUMN IF NOT EXISTS subject character varying (200) DEFAULT NULL;

-- End added slug trigger for mail_templates  setings

--Add slug trigger for pages table

CREATE OR REPLACE FUNCTION set_slug_in_pages() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
  BEGIN
    NEW.slug := slugify(NEW.title, 'pages');
    RETURN NEW;
  END
  $$;

  DROP TRIGGER IF EXISTS insert_slug_page ON pages;
  CREATE TRIGGER insert_slug_page BEFORE INSERT ON pages FOR EACH ROW
    WHEN (NEW.title IS NOT NULL AND NEW.slug IS NULL)
  EXECUTE PROCEDURE set_slug_in_pages();

  ALTER TABLE pages
    ALTER COLUMN slug DROP NOT NULL;
--End slug trigger for pages table
