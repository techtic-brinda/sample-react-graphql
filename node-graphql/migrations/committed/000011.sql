--! Previous: sha1:c82e7271ac8dc3e0b327393487ff2f6b56f2e4d8
--! Hash: sha1:87227f5350b23d5b9290545dcfffbb4775ece38b

-- Enter migration here

CREATE OR REPLACE FUNCTION total_donation() returns numeric as $$
    DECLARE
      found_user private.users;
    BEGIN
      return (SELECT SUM(amount) FROM donations);
    END;
$$ language plpgsql stable;

CREATE OR REPLACE FUNCTION donation_chart_data(start_date date, end_date date) returns json as $$
    DECLARE
      amounts json;
    BEGIN
      amounts :=  (SELECT array_to_json(array_agg(d_data)) FROM (
            SELECT created_at::timestamp::date as date, SUM(amount) as total
            FROM donations 
            where 
              created_at BETWEEN SYMMETRIC start_date and end_date 
            group by created_at::timestamp::date
          ) as d_data);
      return amounts;
    END;
$$ language plpgsql stable;



CREATE SEQUENCE IF NOT EXISTS orphan_requests_seq;
CREATE TABLE IF NOT EXISTS orphan_requests
(
    id bigint NOT NULL DEFAULT nextval('orphan_requests_seq'::regclass),
    user_id bigint NULL,
    institution_id bigint NOT NULL,
    first_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(100) COLLATE pg_catalog."default",
    middel_name character varying(100) COLLATE pg_catalog."default",
    date_of_birth date,
    place_of_birth character varying(100) COLLATE pg_catalog."default",
    country_of_birth character varying(100) COLLATE pg_catalog."default",
    nationality character varying(100) COLLATE pg_catalog."default",
    no_years_in_institution integer,
    comments character varying(5000) COLLATE pg_catalog."default",
    image character varying(255) COLLATE pg_catalog."default",
    status character varying(30) COLLATE pg_catalog."default" NOT NULL DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orphan_requests_pkey PRIMARY KEY (id),
    CONSTRAINT orphan_requests_institution_id_fkey FOREIGN KEY (institution_id)
        REFERENCES institutions (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT orphan_requests_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
