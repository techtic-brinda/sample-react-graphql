--! Previous: sha1:a74c6742208fe9fa6802a776d312ddbfc9d54ab4
--! Hash: sha1:54a39c7b4bd2e9e69ff94279b20d07475e5e37c5

-- Enter migration here
ALTER TABLE orphans
    ALTER COLUMN institution_id DROP NOT NULL,
    ALTER COLUMN middel_name DROP NOT NULL,
    ALTER COLUMN last_name DROP NOT NULL,
    ALTER COLUMN first_name DROP NOT NULL;
