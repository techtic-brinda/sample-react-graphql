--! Previous: sha1:9a9ce303bbdd7963974fcab8bdf2e91e92e6bc17
--! Hash: sha1:a268b9b9955cbcc80b5553011b49cb7011d72671

-- Enter migration here

ALTER TABLE public.donations_category DROP COLUMN IF EXISTS donations_id;

ALTER TABLE public.donations_category
    ADD COLUMN IF NOT EXISTS donation_id bigint NOT NULL;
