CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));

  if lower(new.email) = 'lmdorv@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'super_admin') on conflict (user_id, role) do nothing;
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict (user_id, role) do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'client') on conflict (user_id, role) do nothing;
  end if;

  return new;
end;
$$;

DO $$
DECLARE owner_id uuid;
BEGIN
  SELECT id INTO owner_id FROM auth.users WHERE lower(email) = 'lmdorv@gmail.com' LIMIT 1;
  IF owner_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (owner_id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (owner_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END$$;

CREATE OR REPLACE FUNCTION public.protect_super_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE owner_id uuid;
BEGIN
  SELECT id INTO owner_id FROM auth.users WHERE lower(email) = 'lmdorv@gmail.com' LIMIT 1;
  IF TG_OP = 'DELETE' THEN
    IF OLD.role = 'super_admin' AND OLD.user_id = owner_id THEN
      RAISE EXCEPTION 'Super admin role of the site owner cannot be removed';
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.role = 'super_admin' AND OLD.user_id = owner_id AND NEW.role <> 'super_admin' THEN
      RAISE EXCEPTION 'Super admin role of the site owner cannot be modified';
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END$$;