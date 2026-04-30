ALTER PUBLICATION supabase_realtime ADD TABLE public.project_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_events;
ALTER TABLE public.project_requests REPLICA IDENTITY FULL;
ALTER TABLE public.chat_logs REPLICA IDENTITY FULL;
ALTER TABLE public.analytics_events REPLICA IDENTITY FULL;