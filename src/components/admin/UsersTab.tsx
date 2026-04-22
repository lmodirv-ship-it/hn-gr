import { useEffect, useState } from "react";
import { Loader2, Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}
interface RoleRow {
  user_id: string;
  role: "admin" | "client";
}

export function UsersTab() {
  const [profiles, setProfiles] = useState<ProfileRow[] | null>(null);
  const [roles, setRoles] = useState<RoleRow[]>([]);

  const load = async () => {
    setProfiles(null);
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setProfiles((p as ProfileRow[]) ?? []);
    setRoles((r as RoleRow[]) ?? []);
  };

  useEffect(() => void load(), []);

  const isAdmin = (uid: string) =>
    roles.some((r) => r.user_id === uid && r.role === "admin");

  const toggleAdmin = async (uid: string) => {
    if (isAdmin(uid)) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", uid)
        .eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Admin removed");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Admin granted");
    }
    void load();
  };

  if (profiles === null) {
    return (
      <div className="grid h-40 place-items-center rounded-2xl border border-border">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {profiles.map((p) => {
            const admin = isAdmin(p.id);
            return (
              <tr key={p.id} className="hover:bg-surface/30">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{p.email}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                      admin
                        ? "bg-primary/15 text-primary"
                        : "bg-background/40 text-muted-foreground"
                    }`}
                  >
                    {admin ? "admin" : "client"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => void toggleAdmin(p.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/40"
                  >
                    {admin ? (
                      <>
                        <ShieldOff className="h-3.5 w-3.5" /> Remove admin
                      </>
                    ) : (
                      <>
                        <Shield className="h-3.5 w-3.5" /> Make admin
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
