import { createFileRoute } from "@tanstack/react-router";
import { ChatLogsTab } from "@/components/admin/ChatLogsTab";

export const Route = createFileRoute("/admin/chat")({
  component: () => (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Chat logs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Conversations between visitors and the AI assistant.
        </p>
      </header>
      <ChatLogsTab />
    </div>
  ),
});
