--! Previous: sha1:99c52e835e1c73baaf689e3f52d93bb01a158423
--! Hash: sha1:3026764ab9eabdb7ae65c511b6abcd5cf3afcc8f

-- Enter migration here
ALTER TABLE public.orphan_healths ADD COLUMN IF NOT EXISTS health_review_date timestamp;
ALTER TABLE public.orphan_healths ADD COLUMN IF NOT EXISTS doctor_name character varying(200);

ALTER TABLE public.orphan_healths
    DROP COLUMN IF EXISTS last_doctor,
    ADD COLUMN IF NOT EXISTS last_doctor timestamp;

ALTER TABLE public.orphan_educations ADD COLUMN IF NOT EXISTS education_review_date timestamp;
