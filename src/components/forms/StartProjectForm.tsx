import { useState, type FormEvent } from "react";
import { useSearch } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitProjectRequest } from "@/server/projectRequests";

const projectTypes = ["Website", "E-commerce", "Platform", "Custom software", "Other"] as const;
const budgets = [
  "< $2,000",
  "$2,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
] as const;

export function StartProjectForm() {
  const search = useSearch({ strict: false }) as {
    projectType?: string;
    summary?: string;
  };

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialType =
    projectTypes.find((t) => t.toLowerCase() === (search.projectType ?? "").toLowerCase()) ??
    "Website";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    try {
      await submitProjectRequest({
        data: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          projectType: String(fd.get("projectType") ?? "Website") as
            | "Website"
            | "E-commerce"
            | "Platform"
            | "Custom software"
            | "Other",
          budget: String(fd.get("budget") ?? ""),
          description: String(fd.get("description") ?? ""),
          prefilledFromChat: fd.get("prefilledFromChat") === "on",
        },
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please check the fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-surface/60 p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold">Request received</h3>
        <p className="mt-2 text-muted-foreground">
          Thanks! A HN-groupe expert will reach out within one business day.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm outline-none transition-colors focus:border-primary";

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      {search.summary && (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Suggestion from AI: </span>
          {search.summary}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name">
          <input name="name" required maxLength={120} className={inputCls} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required className={inputCls} />
        </Field>
        <Field label="WhatsApp / Phone">
          <input name="phone" required className={inputCls} />
        </Field>
        <Field label="Project type">
          <select name="projectType" defaultValue={initialType} className={inputCls}>
            {projectTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Budget range">
        <select name="budget" defaultValue={budgets[1]} className={inputCls}>
          {budgets.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </Field>

      <Field label="Project description">
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          defaultValue={search.summary ?? ""}
          className={inputCls}
          placeholder="Tell us about your goals, target users, and any references…"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="prefilledFromChat"
          defaultChecked={Boolean(search.summary)}
          className="h-4 w-4 rounded border-border bg-background"
        />
        Prefill from last AI chat suggestion
      </label>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-gold)] px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitting ? "Sending…" : "Send project request"}
      </button>
    </form>
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
