import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  Sparkles,
  Loader2,
  Lightbulb,
  Layers,
  Palette,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowRight,
  Users,
} from "lucide-react";
import { generateProjectIdea, type ProjectIdea } from "@/server/ideaGenerator";

export const Route = createFileRoute("/idea-generator")({
  head: () => ({
    meta: [
      { title: "AI Idea Generator — HN-GROUPE" },
      {
        name: "description",
        content:
          "Not sure what to build? Tell our AI your business type and budget, and get a tailored project proposal in seconds.",
      },
      { property: "og:title", content: "AI Project Idea Generator — HN-GROUPE" },
      {
        property: "og:description",
        content: "Get a custom project proposal for your business in seconds with HN-GROUPE AI.",
      },
    ],
  }),
  component: IdeaGeneratorPage,
});

const businessExamples = [
  "Restaurant",
  "Online clothing store",
  "Real estate agency",
  "Fitness coach",
  "Law firm",
  "SaaS for HR teams",
];

const budgetOptions = [
  "< $2,000",
  "$2,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
];

const typeToParam: Record<string, string> = {
  Website: "Website",
  "E-commerce": "E-commerce",
  Platform: "Platform",
  "Custom software": "Custom software",
  Other: "Other",
};

function IdeaGeneratorPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idea, setIdea] = useState<ProjectIdea | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setIdea(null);
    const fd = new FormData(e.currentTarget);
    try {
      const result = await generateProjectIdea({
        data: {
          businessType: String(fd.get("businessType") ?? ""),
          budget: String(fd.get("budget") ?? ""),
          extraContext: String(fd.get("extraContext") ?? ""),
        },
      });
      setIdea(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate idea");
    } finally {
      setBusy(false);
    }
  };

  const startThisProject = () => {
    if (!idea) return;
    void navigate({
      to: "/start-project",
      search: {
        projectType: typeToParam[idea.projectType] ?? "Website",
        summary: `${idea.title} — ${idea.description}\n\nKey features: ${idea.features.slice(0, 5).join(", ")}.`,
      },
    });
  };

  const inputCls =
    "w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm outline-none transition-colors focus:border-primary";

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI-powered
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          Don't know what to build?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Tell us your business type and budget. Our AI will design a tailored project proposal —
          features, tech stack, costs, and timeline — in seconds.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mx-auto mt-10 grid max-w-2xl gap-5 rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur"
      >
        <Field label="What's your business or activity?">
          <input
            name="businessType"
            required
            maxLength={100}
            placeholder="e.g. Italian restaurant in Paris"
            className={inputCls}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {businessExamples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={(e) => {
                  const input = (e.currentTarget.closest("form") as HTMLFormElement)
                    .elements.namedItem("businessType") as HTMLInputElement;
                  input.value = ex;
                }}
                className="rounded-full border border-border bg-background/50 px-2.5 py-0.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                {ex}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Your budget">
          <select name="budget" required defaultValue={budgetOptions[2]} className={inputCls}>
            {budgetOptions.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>

        <Field label="Anything else? (optional)">
          <textarea
            name="extraContext"
            rows={2}
            maxLength={500}
            placeholder="e.g. Target young professionals, must support 2 languages…"
            className={inputCls}
          />
        </Field>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-gold)] text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {busy ? "Generating your idea…" : "Generate my project idea"}
        </button>
      </form>

      {idea && (
        <article className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-primary/30 bg-surface/60 shadow-[var(--shadow-gold)] backdrop-blur">
          <div className="border-b border-border bg-[image:var(--gradient-gold)]/10 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              We propose for you
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{idea.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{idea.tagline}</p>
          </div>

          <div className="space-y-6 px-6 py-6">
            <p className="text-sm leading-relaxed text-foreground/90">{idea.description}</p>

            <Section icon={<Users className="h-4 w-4" />} title="Target audience">
              <p className="text-sm text-muted-foreground">{idea.targetAudience}</p>
            </Section>

            <Section icon={<Lightbulb className="h-4 w-4" />} title="Key features">
              <ul className="grid gap-2 sm:grid-cols-2">
                {idea.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={<Palette className="h-4 w-4" />} title="Design direction">
              <p className="text-sm text-muted-foreground">{idea.designSuggestion}</p>
            </Section>

            <Section icon={<Layers className="h-4 w-4" />} title="Tech stack">
              <div className="flex flex-wrap gap-1.5">
                {idea.techStack.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-background/40 px-2 py-1 text-xs text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Section>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard icon={<DollarSign className="h-4 w-4" />} label="Estimated cost" value={idea.estimatedCost} />
              <InfoCard icon={<Clock className="h-4 w-4" />} label="Timeline" value={idea.estimatedTimeline} />
            </div>

            <Section icon={<TrendingUp className="h-4 w-4" />} title="Suggested upsells">
              <ul className="grid gap-2 sm:grid-cols-2">
                {idea.upsells.map((u) => (
                  <li key={u} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {u}
                  </li>
                ))}
              </ul>
            </Section>

            <button
              onClick={startThisProject}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-gold)] text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.01]"
            >
              Start this project
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </article>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <h3 className="text-xs font-semibold uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </div>
  );
}
