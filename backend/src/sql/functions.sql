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


--- ORDERS TABLE

CREATE OR REPLACE FUNCTION update_order_payment_status(
  p_order_id uuid,
  p_status text,
  p_transaction_ref text DEFAULT NULL
) RETURNS void AS 
$$
BEGIN
  UPDATE public.orders 
  SET payment_status = p_status 
  WHERE id = p_order_id;

  IF p_transaction_ref IS NOT NULL THEN
    UPDATE public.payments 
    SET status = p_status, transaction_ref = p_transaction_ref
    WHERE order_id = p_order_id;
  END IF;
END;
$$
 LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;



