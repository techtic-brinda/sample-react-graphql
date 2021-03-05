--! Previous: sha1:0265953fe275db5104bc0f890e36b96d225bbfb9
--! Hash: sha1:a74c6742208fe9fa6802a776d312ddbfc9d54ab4

-- Enter migration here
DROP SEQUENCE IF EXISTS mail_templates_id_seq;

CREATE TABLE IF NOT EXISTS mail_templates
(
 id         bigint NOT NULL DEFAULT nextval('mail_templates_id_seq'::regclass),
 title      varchar(500) NOT NULL,
 slug       varchar(500) NULL,
 "content"   text NULL,
 created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 deleted_at timestamp NULL,
 CONSTRAINT mail_templates_pkey PRIMARY KEY ( id )
);

DROP TABLE if exists orphan_healths cascade;

CREATE TABLE IF NOT EXISTS orphan_healths
(
    id bigint NOT NULL DEFAULT nextval('orphan_healths_id_seq'::regclass),
    orphan_id bigint,
    vaccinations text NOT NULL,
    last_doctor character varying(50) NOT NULL,
    medical_exam text NULL,
    disabilities character varying(500),
    comments text NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orphan_healths_pkey PRIMARY KEY (id),
    CONSTRAINT orphan_healths_orphan_id_fkey FOREIGN KEY (orphan_id)
        REFERENCES orphans (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;
