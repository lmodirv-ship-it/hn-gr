import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "client" | "super_admin";
const OWNER_EMAILS = new Set(["lmdorv@gmail.com", "lmodirv@gmail.com"]);

async function fetchRoles(userId: string): Promise<Role[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) {
    console.error("[useAuth] role fetch error:", error);
    return [];
  }
  return (data ?? []).map((r) => r.role as Role);
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applySession = async (s: Session | null) => {
      if (!mounted) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const r = await fetchRoles(s.user.id);
        if (!mounted) return;
        setRoles(r);
      } else {
        setRoles([]);
      }
      if (mounted) setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
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

  const isOwnerEmail = user?.email ? OWNER_EMAILS.has(user.email.toLowerCase()) : false;
  const isSuperAdmin = roles.includes("super_admin") || isOwnerEmail;
  const isAdmin = isSuperAdmin || roles.includes("admin");
  const role: Role | null = isSuperAdmin
    ? "super_admin"
    : isAdmin
    ? "admin"
    : roles[0] ?? null;

  return {
    session,
    user,
    role,
    roles,
    loading,
    isAdmin,
    isSuperAdmin,
    signOut: () => supabase.auth.signOut(),
  };
}
