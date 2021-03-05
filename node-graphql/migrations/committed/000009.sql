--! Previous: sha1:0e8d1e6c65f10c5d6656685f58092de5b656ced2
--! Hash: sha1:f34319e9669d204b2931a0d62b999df3ee3f1ab2

-- Enter migration here
ALTER TABLE orphans
    ALTER COLUMN nationality TYPE character varying (100);

ALTER TABLE donations
    ALTER COLUMN transaction_id DROP NOT NULL;

ALTER TABLE donations
    ALTER COLUMN payment_data DROP NOT NULL;

ALTER TABLE donations
    ALTER COLUMN description DROP NOT NULL;

ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS status character varying (30) DEFAULT 'active';

ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS deleted_at timestamp DEFAULT NULL;

ALTER TABLE categories
    DROP COLUMN IF EXISTS donations_id,
    ADD COLUMN IF NOT EXISTS donation_id bigint;

ALTER TABLE blog_categories
    ALTER COLUMN status TYPE character varying (50);
ALTER TABLE blog_categories
    ALTER COLUMN status SET DEFAULT 'active';

ALTER TABLE blogs
    ALTER COLUMN status TYPE character varying (50);
ALTER TABLE blogs
    ALTER COLUMN status SET DEFAULT 'active';

ALTER TABLE blogs
    ALTER COLUMN status TYPE character varying (50);

ALTER TABLE blogs
    ALTER COLUMN meta_title TYPE character varying (500);

ALTER TABLE blogs
    ALTER COLUMN meta_description TYPE character varying (500);

ALTER TABLE blogs
    ALTER COLUMN meta_keywords TYPE character varying (500);

ALTER TABLE blogs
    ALTER COLUMN featured_image TYPE character varying (300);
