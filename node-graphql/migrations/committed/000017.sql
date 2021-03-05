--! Previous: sha1:af1cb8bf073fd79350ac50a0d9900f4887b20ea5
--! Hash: sha1:31d4de6a0b0f719def11055274eff235c8c33a14

-- Enter migration here
DROP FUNCTION IF EXISTS verify_account;
-- Registers a single user and creates an account.
CREATE OR REPLACE FUNCTION verify_account(
    token text
) returns boolean as $$
DECLARE
    private_person private.users;
BEGIN
    SELECT INTO private_person * FROM private.users WHERE email_verify_token = token;
    IF private_person IS NULL THEN
        RAISE EXCEPTION 'Something went wrong. Please try again later.';
        RETURN false;
    END IF;
        UPDATE private.users SET email_verify_token = '' where id = private_person.id;
        UPDATE public.users SET email_verified_at = NOW() where id = private_person.user_id;
        return true;
END;
$$ language plpgsql strict security definer;

DROP FUNCTION IF EXISTS verify_new_email;
-- Registers a single user and creates an account.
CREATE OR REPLACE FUNCTION verify_new_email(
    token BigInt
) returns boolean as $$
DECLARE
    public_person public.users;
BEGIN
    SELECT INTO public_person * FROM public.users WHERE id = token;
    IF public_person.updated_email IS NULL THEN
        RAISE EXCEPTION 'Something went wrong. Please try again later.';
        RETURN false;
    END IF;
        UPDATE public.users SET email = updated_email, updated_email= NULL where id = public_person.id;
        return true;
END;
$$ language plpgsql strict security definer;


ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_email character varying(200);

CREATE SEQUENCE IF NOT EXISTS champion_request_id_seq;
CREATE TABLE IF NOT EXISTS champion_request
(
    id                       bigint NOT NULL DEFAULT nextval('champion_request_id_seq'::regclass),
    orphan_id                bigint NOT NULL,
    champion_id              bigint NOT NULL,
    status character varying(20) NOT NULL DEFAULT 'pending'::character varying,
    created_at               timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at               timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT champion_request_pkey PRIMARY KEY ( id ),
    CONSTRAINT champion_request_orphan_id_fkey FOREIGN KEY (orphan_id)
        REFERENCES orphans (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT champion_request_champion_id_fkey FOREIGN KEY (champion_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE SEQUENCE IF NOT EXISTS champion_orphan_id_seq;
CREATE TABLE IF NOT EXISTS champion_orphan
(
    id                       bigint NOT NULL DEFAULT nextval('champion_orphan_id_seq'::regclass),
    orphan_id                bigint NOT NULL,
    champion_id              bigint NOT NULL,
    created_at               timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at               timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT champion_orphan_pkey PRIMARY KEY ( id ),
    CONSTRAINT champion_orphan_orphan_id_fkey FOREIGN KEY (orphan_id)
        REFERENCES orphans (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT champion_orphan_champion_id_fkey FOREIGN KEY (champion_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- Created function `search_orphans` with a text argument named `search`.
DROP FUNCTION IF EXISTS search_orphans;
create function search_orphans(
    search text,
    champion integer
) returns setof orphans as $$
    select *
    from orphans
        WHERE id NOT IN (SELECT champion_request.orphan_id
        FROM champion_request WHERE champion_request.champion_id = champion) 
      AND (
        first_name ilike ('%' || search || '%') or
        last_name ilike ('%' || search || '%')
      );
$$ language sql stable;
