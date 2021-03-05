--! Previous: sha1:afbd7047fe7bf7b317688b96c728d05b4283c08c
--! Hash: sha1:d5fb5e2361fd5763591db02cc9809ab40ed2ef13

-- Enter migration here
ALTER TABLE users ADD COLUMN IF NOT EXISTS address character varying(200);

ALTER TABLE blogs ADD COLUMN IF NOT EXISTS featured_image character varying(200);
