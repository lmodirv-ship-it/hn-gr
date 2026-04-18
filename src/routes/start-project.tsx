import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { StartProjectForm } from "@/components/forms/StartProjectForm";

const searchSchema = z.object({
  projectType: fallback(z.string(), "").optional(),
  summary: fallback(z.string(), "").optional(),
});

export const Route = createFileRoute("/start-project")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Start your project — HN-groupe" },
      {
        name: "description",
        content:
          "Send your project request to HN-groupe. Tell us about your goals and we'll get back within one business day.",
      },
      { property: "og:title", content: "Start your project — HN-groupe" },
      {
        property: "og:description",
        content: "Get in touch with HN-groupe to start your next website, store, or platform.",
      },
    ],
  }),
  component: StartProjectPage,
});

function StartProjectPage() {
  return (
    <>
      <section className="border-b border-border/60" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Start your project</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Tell us about your idea. The more context you share, the sharper our first
            proposal will be.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-10">
          <StartProjectForm />
        </div>
      </section>
    </>
  );
}
