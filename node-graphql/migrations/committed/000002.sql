--! Previous: sha1:fcd0dd5dab9724a7f4f62d71bf375f04285f5e20
--! Hash: sha1:ac5e4189ba51bd558b91a950fd7abeeb56d0171e

-- Enter migration here

CREATE SEQUENCE IF NOT EXISTS blogs_id_seq;
-- DROP table if EXISTS blog_blog_category;
-- DROP table if EXISTS blogs;
-- DROP table if EXISTS blog_categories;

-- Create blogs table
  CREATE TABLE IF NOT EXISTS  blogs
  (
      id bigint NOT NULL DEFAULT nextval('blogs_id_seq'::regclass),
      title character varying(500)  NOT NULL,
      slug character varying(500)  NULL,
      content text  NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT blogs_pkey PRIMARY KEY (id)
  )
  TABLESPACE pg_default;

  CREATE OR REPLACE FUNCTION set_slug_in_blogs() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
  BEGIN
    NEW.slug := slugify(NEW.title, 'blogs');
    RETURN NEW;
  END
  $$;

  DROP TRIGGER IF EXISTS insert_slug ON blogs;
  CREATE TRIGGER insert_slug BEFORE INSERT ON blogs FOR EACH ROW
    WHEN (NEW.title IS NOT NULL AND NEW.slug IS NULL)
  EXECUTE PROCEDURE set_slug_in_blogs();
-- End: Create blogs table

  CREATE SEQUENCE IF NOT EXISTS blog_categories_id_seq;
  CREATE TABLE IF NOT EXISTS blog_categories
  (
      id bigint NOT NULL DEFAULT nextval('blog_categories_id_seq'::regclass),
      name character varying(500) NOT NULL,
      slug character varying(500) NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT blog_categories_pkey PRIMARY KEY (id)
  );

  CREATE OR REPLACE FUNCTION set_slug_in_blog_categories() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
  BEGIN
    NEW.slug := slugify(NEW.name, 'blog_categories');
    RETURN NEW;
  END
  $$;

  DROP TRIGGER IF EXISTS insert_slug ON blog_categories;
  CREATE TRIGGER insert_slug BEFORE INSERT ON blog_categories FOR EACH ROW
    WHEN (NEW.name IS NOT NULL AND NEW.slug IS NULL)
  EXECUTE PROCEDURE set_slug_in_blog_categories();

-- Create blog_blog_category table
-- CREATE SEQUENCE IF NOT EXISTS blog_blog_category_id_seq;

CREATE TABLE IF NOT EXISTS blog_blog_category
(
    -- id bigint NOT NULL DEFAULT nextval('blog_blog_category_id_seq'::regclass),
    blog_id bigint CONSTRAINT blog_blog_category_users_fkey  REFERENCES blogs (id),
    blog_category_id bigint CONSTRAINT blog_blog_category_roles_fkey REFERENCES blog_categories (id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    primary key (blog_id, blog_category_id)
)
TABLESPACE pg_default;
COMMENT ON TABLE blog_blog_category IS E'@omit manyToMany';
-- End: Create blog_blog_category table



CREATE SEQUENCE IF NOT EXISTS institutions_id_seq;
CREATE TABLE IF NOT EXISTS  institutions
(
    id bigint NOT NULL DEFAULT nextval('institutions_id_seq'::regclass),
    name character varying(50) NOT NULL,
    address character varying(255),
    state character varying(50),
    country character varying(50),
    local_license character varying(500),
    contact_name character varying(50),
    contact_email character varying(50),
    contact_phone character varying(20),
    non_profit boolean,
    adoption boolean,
    orphan_age integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT institutions_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;


CREATE SEQUENCE IF NOT EXISTS orphans_id_seq;
CREATE TABLE IF NOT EXISTS orphans
(
    id bigint NOT NULL DEFAULT nextval('orphans_id_seq'::regclass),
    user_id bigint,
    institution_id bigint NOT NULL,
    fist_name character varying(50) NOT NULL,
    lastname character varying(50),
    middel_name character varying(50),
    date_of_birth timestamp with time zone,
    place_of_birth character varying(50),
    country_of_birth character varying(50),
    nationality character varying(50),
    no_years_in_institution integer,
    comments character varying(500),
    image character varying(255),
    status character varying(20) NOT NULL DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orphans_pkey PRIMARY KEY (id),
    CONSTRAINT orphans_institution_id_fkey FOREIGN KEY (institution_id)
        REFERENCES institutions (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT orphans_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;
