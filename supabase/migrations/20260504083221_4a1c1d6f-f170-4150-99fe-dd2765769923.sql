CREATE OR REPLACE FUNCTION public.get_public_site_stats()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_online int;
  v_total_visitors int;
  v_registered int;
BEGIN
  SELECT COUNT(DISTINCT session_id) INTO v_online
  FROM public.analytics_events
  WHERE created_at > now() - interval '5 minutes' AND session_id IS NOT NULL;

  SELECT COUNT(DISTINCT session_id) INTO v_total_visitors
  FROM public.analytics_events
  WHERE session_id IS NOT NULL;

  SELECT COUNT(*) INTO v_registered FROM public.profiles;

  RETURN jsonb_build_object(
    'online',     1000   + COALESCE(v_online, 0),
    'visitors',   100000 + COALESCE(v_total_visitors, 0),
    'registered', 10000  + COALESCE(v_registered, 0)
  );
END;
$function$;