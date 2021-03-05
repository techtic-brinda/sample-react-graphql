--! Previous: sha1:6f96cca7e8dd0febce5546d3eaaab689b9cd810e
--! Hash: sha1:e97ad86c7a4ebd2628ab5d83ccca032ef284484f

-- Enter migration here

ALTER TABLE institutions
ALTER COLUMN non_profit TYPE character varying(5),
ALTER COLUMN adoption TYPE character varying(5);
--Create orphan education tabel 
CREATE SEQUENCE IF NOT EXISTS orphan_educations_id_seq;
CREATE TABLE IF NOT EXISTS orphan_educations
(
    id bigint NOT NULL DEFAULT nextval('orphan_educations_id_seq'::regclass),
    orphan_id bigint,
    grade character varying(50) NOT NULL,
    comment character varying(500),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orphan_educations_pkey PRIMARY KEY (id),
    CONSTRAINT orphan_educations_orphan_id_fkey FOREIGN KEY (orphan_id)
        REFERENCES orphans (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
TABLESPACE pg_default;

--End of create orphan education tabel 

--Create orphan_healths tabel 
CREATE SEQUENCE IF NOT EXISTS orphan_healths_id_seq;
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

--End of create orphan_healths tabel 

--ALter date of birth column datatype

ALTER TABLE orphans
ALTER COLUMN date_of_birth TYPE DATE;



-- Create notification_templates table

CREATE SEQUENCE IF NOT EXISTS notification_templates_seq;
CREATE TABLE IF NOT EXISTS notification_templates
(
 id         bigint NOT NULL DEFAULT nextval('notification_templates_seq'::regclass),
 title      varchar(500) NOT NULL,
 slug       varchar(500) NOT NULL,
 "content"   text NULL,
 created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 deleted_at timestamp NULL,
 CONSTRAINT notification_templates_pkey PRIMARY KEY ( id )
);


-- Create mail_templates

CREATE SEQUENCE IF NOT EXISTS orphan_healths_id_seq;
CREATE TABLE IF NOT EXISTS mail_templates
(
 id         bigint NOT NULL DEFAULT nextval('orphan_healths_id_seq'::regclass),
 title      varchar(500) NOT NULL,
 slug       varchar(500) NULL,
 "content"   text NULL,
 created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 deleted_at timestamp NULL,
 CONSTRAINT mail_templates_pkey PRIMARY KEY ( id )
);


CREATE SEQUENCE IF NOT EXISTS orphan_needs_seq;
CREATE TABLE IF NOT EXISTS orphan_needs
(
    id                       bigint NOT NULL DEFAULT nextval('orphan_needs_seq'::regclass),
    orphan_id                bigint NOT NULL,
    title                    varchar(100) NOT NULL,
    amount                   decimal(10,2) NOT NULL,
    received_donation_amount decimal(10,2) NOT NULL DEFAULT 0,
    description              varchar(500) NULL,
    close_date               timestamp NULL,
    created_at               timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at               timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orphan_needs_pkey PRIMARY KEY ( id ),
    CONSTRAINT orphan_needs_orphan_id_fkey FOREIGN KEY (orphan_id)
        REFERENCES orphans (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE SEQUENCE IF NOT EXISTS donations_seq;
CREATE TABLE IF NOT EXISTS donations
(
    id             bigint NOT NULL DEFAULT nextval('donations_seq'::regclass),
    user_id        bigint NOT NULL,
    orphan_id     bigint NOT NULL,
    orphan_need_id bigint NULL,
    amount         decimal(10,2) NOT NULL,
    description    varchar(500) NOT NULL,
    created_at     timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at     timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    transaction_id varchar(50) NOT NULL,
    payment_data   json NOT NULL,
    CONSTRAINT donations_pkey PRIMARY KEY ( id ),
    
    CONSTRAINT donations_orphan_id_fkey FOREIGN KEY (orphan_id)
        REFERENCES orphans (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    
    CONSTRAINT donations_orphan_need_id_fkey FOREIGN KEY (orphan_need_id)
        REFERENCES orphan_needs (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    
    CONSTRAINT donations_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);



CREATE SEQUENCE IF NOT EXISTS categories_seq;
CREATE TABLE IF NOT EXISTS categories
(
    id         bigint NOT NULL DEFAULT nextval('categories_seq'::regclass),
    name       varchar(50) NOT NULL,
    created_at timestamp NULL DEFAULT Now(),
    updated_at timestamp NULL DEFAULT Now(),
    deleted_at timestamp NULL,
    CONSTRAINT categories_pkey PRIMARY KEY ( id )
);


CREATE SEQUENCE IF NOT EXISTS donations_category_seq;
CREATE TABLE IF NOT EXISTS donations_category
(
    id            bigint NOT NULL DEFAULT nextval('donations_category_seq'::regclass),
    donations_id  bigint NOT NULL,
    category_id   bigint NOT NULL,
    amount        decimal(10,2) NOT NULL,
    CONSTRAINT donations_category_pkey PRIMARY KEY ( id ),
 
    CONSTRAINT donations_category_category_id_fkey FOREIGN KEY (category_id)
        REFERENCES categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    
    CONSTRAINT donations_category_donations_id_fkey FOREIGN KEY (donations_id)
        REFERENCES donations (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
COMMENT ON TABLE donations_category IS E'@omit manyToMany';

CREATE SEQUENCE IF NOT EXISTS security_questions_seq;
CREATE TABLE IF NOT EXISTS security_questions
(
    id         bigint NOT NULL DEFAULT nextval('security_questions_seq'::regclass),
    question   varchar(500) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp NULL,
    CONSTRAINT security_questions_pkey PRIMARY KEY ( id )
);


CREATE SEQUENCE IF NOT EXISTS notifications_seq;
CREATE TABLE IF NOT EXISTS notifications
(
    id         bigint NOT NULL DEFAULT nextval('notifications_seq'::regclass),
    user_id    bigint NOT NULL,
    title      varchar(500) NOT NULL,
    data       json NOT NULL,
    read_at    timestamp NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY ( id ),
    CONSTRAINT notifications_users_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE SEQUENCE IF NOT EXISTS settings_seq;
CREATE TABLE IF NOT EXISTS  settings
(
    id     bigint NOT NULL DEFAULT nextval('settings_seq'::regclass),
    key   varchar(500) NOT NULL,
    value varchar(500) NOT NULL,
    CONSTRAINT settings_pkey PRIMARY KEY ( id )
);


CREATE SEQUENCE IF NOT EXISTS users_security_questions_seq;
CREATE TABLE IF NOT EXISTS  users_security_questions
(
    id                   bigint NOT NULL DEFAULT nextval('users_security_questions_seq'::regclass),
    user_id              bigint NOT NULL,
    security_question_id bigint NOT NULL,
    answer               varchar(500) NOT NULL,
    created_at           timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at           timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_security_questions_pkey PRIMARY KEY ( id ),
    CONSTRAINT users_security_questions_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT users_security_questions_question_id_fkey FOREIGN KEY (security_question_id)
        REFERENCES security_questions (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMENT ON TABLE users_security_questions IS E'@omit manyToMany';
