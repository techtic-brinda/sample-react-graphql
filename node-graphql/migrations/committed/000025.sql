--! Previous: sha1:54a39c7b4bd2e9e69ff94279b20d07475e5e37c5
--! Hash: sha1:ca6ee927e3dd518c4bb86caeca65759fb383ab21

-- Enter migration here
ALTER TABLE orphans ADD COLUMN IF NOT EXISTS gender character varying(10);
ALTER TABLE orphans ADD COLUMN IF NOT EXISTS age integer;

-- Created function `search_orphans` with a text argument named `search`.
DROP FUNCTION IF EXISTS search_orphans;
create function search_orphans(
    search text,
    gender text,
    age integer,
    champion integer
) returns setof orphans as $$
    select *
    from orphans
        WHERE id NOT IN (SELECT DISTINCT champion_request.orphan_id FROM champion_request) 
      AND (
        first_name ilike ('%' || search || '%') or
        last_name ilike ('%' || search || '%')
      ) or
      gender ilike ('%' || gender || '%') or
      age = age
      ;
$$ language sql stable;

ALTER TABLE orphan_needs DROP COLUMN IF EXISTS category_id;
ALTER TABLE orphan_needs ADD COLUMN IF NOT EXISTS category_id bigint,
add CONSTRAINT orphan_needs_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE;

ALTER TABLE orphan_needs
ALTER COLUMN title DROP NOT NULL;

DROP TABLE IF EXISTS donations_category;
CREATE SEQUENCE IF NOT EXISTS donations_category_seq;
CREATE TABLE IF NOT EXISTS donations_category
(
    id            bigint NOT NULL DEFAULT nextval('donations_category_seq'::regclass),
    donation_id  bigint NOT NULL,
    category_id   bigint NOT NULL,
    amount        decimal(10,2) NOT NULL,
    CONSTRAINT donations_category_pkey PRIMARY KEY ( id ),
 
    CONSTRAINT donations_category_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    
    CONSTRAINT donations_category_donation_id_fkey FOREIGN KEY (donation_id)
        REFERENCES donations (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
COMMENT ON TABLE donations_category IS E'@omit manyToMany';
