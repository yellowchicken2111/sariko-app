--- CREATE FUNCTION TO INSERT USERS TABLE AFTER AUTH.USERS CREATED RECORD
CREATE OR REPLACE FUNCTION public.handle_user_create()
RETURNS TRIGGER AS 
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = new.id) THEN
        INSERT INTO public.users (
          id, 
          email, 
          name, 
          is_seller,
          created_at, 
          updated_at
        ) VALUES (
            new.id,
            new.email,
            new.raw_user_meta_data->>'fullname',
            new.raw_user_meta_data->>'is_seller',
            new.created_at, 
            new.updated_at
        );
    END IF;
    RETURN new;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;

--- CREATE FUNCTION TO INSERT USERS TABLE AFTER AUTH.USERS CREATED RECORD
CREATE OR REPLACE FUNCTION public.handle_user_create()
RETURNS TRIGGER AS 
$$
BEGIN
    UPDATE public.users
    SET
        avatar_url = new.raw_user_meta_data->>'avatar_url',
        phone = new.phone,
        updated_at = new.updated_at
    WHERE id = new.id;
    RETURN new;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;




