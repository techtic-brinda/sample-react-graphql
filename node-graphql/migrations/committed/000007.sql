--! Previous: sha1:e97ad86c7a4ebd2628ab5d83ccca032ef284484f
--! Hash: sha1:0031f1301dabc6401d853756aaf459c5aab3ae7b

-- Enter migration here

ALTER TABLE public.orphans
    RENAME fist_name TO first_name;

ALTER TABLE public.orphans
    ALTER COLUMN first_name TYPE character varying (100) COLLATE pg_catalog."default";

ALTER TABLE public.orphans
    RENAME lastname TO last_name;

ALTER TABLE public.orphans
    ALTER COLUMN last_name TYPE character varying (100) COLLATE pg_catalog."default";

ALTER TABLE public.orphans
    ALTER COLUMN middel_name TYPE character varying (100) COLLATE pg_catalog."default";

ALTER TABLE public.orphans
    ALTER COLUMN place_of_birth TYPE character varying (100) COLLATE pg_catalog."default";

ALTER TABLE public.orphans
    ALTER COLUMN country_of_birth TYPE character varying (100) COLLATE pg_catalog."default";

ALTER TABLE public.orphans
    ALTER COLUMN comments TYPE character varying (5000) COLLATE pg_catalog."default";

ALTER TABLE public.orphans
    ALTER COLUMN status TYPE character varying (30) COLLATE pg_catalog."default";

