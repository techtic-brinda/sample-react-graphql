--! Previous: sha1:31d4de6a0b0f719def11055274eff235c8c33a14
--! Hash: sha1:fc358bf5f6cdb3e5c4d9978dea6397e6d12eb9f4

-- Enter migration here
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS stripe_id character varying(200);
