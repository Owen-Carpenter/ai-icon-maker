-- Remove duplicate foreign key constraints from icons table

-- First, let's check what foreign key constraints exist and remove duplicates
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- Get all foreign key constraints on the icons table that reference auth.users
    FOR constraint_record IN 
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = 'icons' 
        AND tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = 'users'
        AND ccu.table_schema = 'auth'
    LOOP
        -- Drop each foreign key constraint
        EXECUTE 'ALTER TABLE icons DROP CONSTRAINT IF EXISTS ' || constraint_record.constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_record.constraint_name;
    END LOOP;
END $$;

-- Now add back only one clean foreign key constraint
ALTER TABLE icons 
ADD CONSTRAINT icons_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
