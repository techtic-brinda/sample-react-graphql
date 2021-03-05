--! Previous: sha1:a268b9b9955cbcc80b5553011b49cb7011d72671
--! Hash: sha1:bea63e1c7c1016d177ea4f0df94da4e88abe54d6

-- Enter migration here
DROP TRIGGER IF EXISTS insert_slug ON donation_categories;
DROP FUNCTION IF EXISTS set_slug_in_donation_categories;
DROP TABLE IF EXISTS donation_categories;
