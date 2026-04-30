import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "client" | null;

async function fetchRole(userId: string): Promise<Role> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[useAuth] role fetch error:", error);
    return null;
  }
  return (data?.role as Role) ?? null;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applySession = async (s: Session | null) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const r = await fetchRole(s.user.id);
        if (!mounted) return;
        setRole(r);
      } else {
        setRole(null);
      }
      if (mounted) setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      // Defer async work outside the listener to avoid deadlocks
      setTimeout(() => {
        void applySession(s);
      }, 0);
    });

    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      void applySession(s);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    role,
    loading,
    isAdmin: role === "admin",
    signOut: () => supabase.auth.signOut(),
  };
}
