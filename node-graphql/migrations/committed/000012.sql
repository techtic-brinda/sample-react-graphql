--! Previous: sha1:87227f5350b23d5b9290545dcfffbb4775ece38b
--! Hash: sha1:9a9ce303bbdd7963974fcab8bdf2e91e92e6bc17

-- Enter migration here

ALTER TABLE settings 
    DROP CONSTRAINT IF EXISTS settings_key_unique;
ALTER TABLE settings
    ADD CONSTRAINT settings_key_unique UNIQUE (key);


DROP FUNCTION IF EXISTS save_bluk_settings;
DROP FUNCTION IF EXISTS save_bluk_settings123;
DROP FUNCTION IF EXISTS update_bluk_settings;

CREATE FUNCTION save_bluk_settings(settings_value settings[], delete_other boolean = false) returns settings[] as $$
    DECLARE
      item settings;
    BEGIN
        IF delete_other THEN
            DELETE FROM settings where true;
        END IF;
        RAISE NOTICE 'settings_value = %', settings_value;
        FOREACH item IN ARRAY settings_value
        LOOP
            INSERT INTO settings ("key", "value") 
                VALUES (item.key,item.value)
            ON CONFLICT ("key") DO UPDATE 
                SET "value" = item.value;
        END LOOP;

        --SELECT setval('settings_seq', MAX(id)) FROM settings;
      
      return settings_value;
    END;
$$ language plpgsql strict security definer;
