--! Previous: sha1:7d7217ef3f7b5c3516870502326a1516e9884aa7
--! Hash: sha1:3822853ad83941d2ee5e6ac79e40987b7474f5b7

-- Enter migration here
ALTER TABLE donations_category
    ALTER COLUMN percentage TYPE decimal(10,2);
