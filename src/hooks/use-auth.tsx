import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "client" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // Defer role fetch to avoid deadlocks
        setTimeout(() => {
          void supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", s.user.id)
            .maybeSingle()
            .then(({ data }) => setRole((data?.role as "admin" | "client") ?? null));
        }, 0);
      } else {
        setRole(null);
      }
    });

    void supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (s?.user) {
        void supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", s.user.id)
          .maybeSingle()
          .then(({ data }) => setRole((data?.role as "admin" | "client") ?? null));
      }
    });

    return () => sub.subscription.unsubscribe();
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
