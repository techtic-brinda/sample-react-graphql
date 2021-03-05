--! Previous: sha1:30b36599ce5c0fc56063298be49f662f0642244d
--! Hash: sha1:5ec94ae8a54658eaa456ad01990c929643ec1f1e

-- Enter migration here
ALTER TABLE donations
    ALTER COLUMN transaction_id TYPE character varying (250);

ALTER TABLE donations_category ADD COLUMN IF NOT EXISTS percentage integer;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS admin_fees decimal(10,2);
