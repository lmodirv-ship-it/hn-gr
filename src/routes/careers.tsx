import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Send, Briefcase, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — HN-GROUPE" },
      { name: "description", content: "Join the HN-GROUPE team. Submit your CV and grow with a future-focused engineering collective." },
      { property: "og:title", content: "Careers — HN-GROUPE" },
      { property: "og:description", content: "Open roles and CV submissions at HN-GROUPE." },
    ],
  }),
  component: CareersPage,
});

const SPECIALTIES = [
  "Frontend Engineering",
  "Backend Engineering",
  "Full-Stack",
  "Mobile Development",
  "DevOps / Cloud",
  "UI / UX Design",
  "Product Management",
  "AI / ML",
  "Web3 / Smart Contracts",
  "Marketing / Growth",
  "Other",
];

const Schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  specialty: z.string().min(1),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

function CareersPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = Schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    if (!file) {
      toast.error("Please attach your CV (PDF or DOCX)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("CV must be smaller than 10 MB");
      return;
    }
    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop() ?? "pdf";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const up = await supabase.storage.from("cvs").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (up.error) throw up.error;

      const { error } = await supabase.from("job_applications").insert({
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        specialty: parsed.data.specialty,
        message: parsed.data.message || null,
        cv_path: path,
      });
      if (error) throw error;

      setDone(true);
      toast.success("Application submitted");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-16 text-center">
        <div>
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-bold">Application received</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for applying to HN-GROUPE. Our team will review your profile and reach out
            shortly if there is a match.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Briefcase className="h-3.5 w-3.5" /> Careers
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Join HN-GROUPE</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          We are always looking for engineers, designers, and operators who want to build
          enterprise-grade products. Submit your CV and tell us what you do best.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="full_name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone" name="phone" type="tel" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Specialty <span className="text-destructive">*</span>
            </label>
            <select
              name="specialty"
              required
              defaultValue=""
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="" disabled>
                Select your field…
              </option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Cover note
          </label>
          <textarea
            name="message"
            rows={4}
            maxLength={2000}
            placeholder="Tell us about your experience and what role you're looking for…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            CV <span className="text-destructive">*</span>{" "}
            <span className="text-muted-foreground/70">(PDF or DOCX, max 10 MB)</span>
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className="block w-full cursor-pointer rounded-lg border border-dashed border-border bg-background px-3 py-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
          />
        </div>

        <button
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" /> Submit application
            </>
          )}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
