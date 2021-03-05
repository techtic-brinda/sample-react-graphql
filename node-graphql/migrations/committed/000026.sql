--! Previous: sha1:ca6ee927e3dd518c4bb86caeca65759fb383ab21
--! Hash: sha1:30b36599ce5c0fc56063298be49f662f0642244d

-- Enter migration here

  DROP TABLE IF EXISTS comments;
  CREATE SEQUENCE IF NOT EXISTS comments_id_seq;
  CREATE TABLE IF NOT EXISTS comments
  (
      id bigint NOT NULL DEFAULT nextval('comments_id_seq'::regclass),
      name character varying(500) NOT NULL,
      email character varying(500) NULL,
      phone character varying(50),
      comment character varying(500),
      user_id bigint NULL,
      blog_id bigint NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      deleted_at timestamp with time zone DEFAULT NULL,
      CONSTRAINT comments_pkey PRIMARY KEY (id),

    CONSTRAINT blogs_blog_id_fkey FOREIGN KEY (blog_id)
        REFERENCES blogs (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT users_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
