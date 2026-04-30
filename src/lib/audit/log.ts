import { supabase } from "@/integrations/supabase/client";

/**
 * Record an admin action in `activity_logs`.
 * Failures are swallowed so the user-facing flow is never blocked
 * by a logging error.
 */
export async function logActivity(params: {
  action: string;
  targetType?: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("activity_logs").insert({
      user_id: user?.id ?? null,
      actor_email: user?.email ?? null,
      action: params.action,
      target_type: params.targetType ?? null,
      target_id: params.targetId ?? null,
      metadata: params.metadata ?? {},
    });
  } catch (err) {
    console.warn("[audit] failed to log activity", err);
  }
}
