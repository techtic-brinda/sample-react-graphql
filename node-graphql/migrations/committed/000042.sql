--! Previous: sha1:ea5b68f81fb8120b15635a84b55a289e1477d155
--! Hash: sha1:36ed09eb5098aca05a556142376fdaff2b9faa46

-- Enter migration here

 -- Create new tables for faq
 
CREATE SEQUENCE IF NOT EXISTS faq_id_seq;
CREATE TABLE IF NOT EXISTS faq
(
 id         bigint NOT NULL DEFAULT nextval('faq_id_seq'::regclass),
 question   text NULL,
 answer     text NULL,
 status character varying(20) NOT NULL DEFAULT 'active',
 created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT faq_pkey PRIMARY KEY ( id )
);
