import { createFileRoute } from "@tanstack/react-router";
import { ChatLogsTab } from "@/components/admin/ChatLogsTab";
import { useAdminT } from "@/lib/i18n/adminText";

export const Route = createFileRoute("/admin/chat")({
  component: ChatPage,
});

function ChatPage() {
  const tt = useAdminT();
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{tt("section.admin")}</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{tt("chat.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {tt("chat.subtitle")}
        </p>
      </header>
      <ChatLogsTab />
    </div>
  );
}
