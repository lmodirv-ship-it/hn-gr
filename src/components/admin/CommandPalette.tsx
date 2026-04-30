import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  MessageSquare,
  Wrench,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  Home,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    void navigate({ to });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-md border border-border bg-surface/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:inline-flex"
      >
        <span>Search…</span>
        <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => go("/admin")}>
              <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
            </CommandItem>
            <CommandItem onSelect={() => go("/admin/leads")}>
              <Briefcase className="mr-2 h-4 w-4" /> Leads
            </CommandItem>
            <CommandItem onSelect={() => go("/admin/users")}>
              <Users className="mr-2 h-4 w-4" /> Users
            </CommandItem>
            <CommandItem onSelect={() => go("/admin/analytics")}>
              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
            </CommandItem>
            <CommandItem onSelect={() => go("/admin/chat")}>
              <MessageSquare className="mr-2 h-4 w-4" /> Chat logs
            </CommandItem>
            <CommandItem onSelect={() => go("/admin/services")}>
              <Wrench className="mr-2 h-4 w-4" /> Services
            </CommandItem>
            <CommandItem onSelect={() => go("/admin/portfolio")}>
              <ImageIcon className="mr-2 h-4 w-4" /> Portfolio
            </CommandItem>
            <CommandItem onSelect={() => go("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.open("/", "_blank");
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" /> View live site
            </CommandItem>
            <CommandItem onSelect={() => go("/")}>
              <Home className="mr-2 h-4 w-4" /> Go to homepage
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                void supabase.auth.signOut();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
