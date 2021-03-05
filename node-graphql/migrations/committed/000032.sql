--! Previous: sha1:f462a990d5e3eea98916bc442cb881a7255c5eb4
--! Hash: sha1:7d7217ef3f7b5c3516870502326a1516e9884aa7

-- Enter migration here
ALTER TABLE donations_category ADD COLUMN IF NOT EXISTS percentage decimal(10,2);
