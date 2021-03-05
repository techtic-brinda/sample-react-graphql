--! Previous: sha1:5ec94ae8a54658eaa456ad01990c929643ec1f1e
--! Hash: sha1:ada61702be66a15408c74ec84d6bead9afe845b5

-- Enter migration here


DROP TABLE IF EXISTS pages;
DROP SEQUENCE IF EXISTS pages_id_seq;
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
