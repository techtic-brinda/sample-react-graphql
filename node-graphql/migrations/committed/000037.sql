--! Previous: sha1:3026764ab9eabdb7ae65c511b6abcd5cf3afcc8f
--! Hash: sha1:834f4560a2aad7df1f6c35730154a4c071f9ef5d

-- Enter migration here
ALTER TABLE blog_blog_category 
    DROP CONSTRAINT blog_blog_category_users_fkey,
    DROP CONSTRAINT blog_blog_category_roles_fkey,
    ADD CONSTRAINT blog_blog_category_users_fkey FOREIGN KEY (blog_id)
        REFERENCES blogs (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    ADD CONSTRAINT blog_blog_category_roles_fkey FOREIGN KEY (blog_category_id)
        REFERENCES blog_categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE;
