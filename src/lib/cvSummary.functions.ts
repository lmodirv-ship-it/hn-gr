import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  applicationId: z.string().uuid(),
});

const SYSTEM_PROMPT = `You are a recruiter assistant. Given an applicant's specialty, message and (optionally) excerpts of their CV, produce a concise summary (max ~50 words) of their KEY skills and seniority. Plain text. No greetings.`;

export const generateCvSummary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Verify caller is admin/super_admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const isAdmin = (roles ?? []).some(
      (r: { role: string }) => r.role === "admin" || r.role === "super_admin",
    );
    if (!isAdmin) throw new Response("Forbidden", { status: 403 });

    // Service-role client to access the private CV bucket and update record
    const admin = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: app, error: appErr } = await admin
      .from("job_applications")
      .select("id, full_name, specialty, message, cv_path")
      .eq("id", data.applicationId)
      .maybeSingle();
    if (appErr || !app) throw new Response("Application not found", { status: 404 });

    let cvText = "";
    if (app.cv_path) {
      const { data: file } = await admin.storage.from("cvs").download(app.cv_path);
      if (file) {
        const buf = await file.arrayBuffer();
        // Best-effort: extract printable ASCII/Latin text. Works for plain text and
        // gives a noisy-but-useful signal from PDFs/DOCX without a heavy parser.
        const raw = new TextDecoder("utf-8", { fatal: false }).decode(buf);
        cvText = raw
          .replace(/[^\x20-\x7E\n\r\t\u00A0-\u024F]/g, " ")
          .replace(/\s+/g, " ")
          .slice(0, 6000);
      }
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Response("AI gateway not configured", { status: 500 });

    const userContent = `Applicant: ${app.full_name}
Specialty: ${app.specialty}
Cover message: ${app.message ?? "(none)"}

CV text excerpt:
${cvText || "(no CV attached or unreadable)"}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text().catch(() => "");
      console.error("AI gateway error", aiRes.status, txt);
      throw new Response("AI summary failed", { status: 502 });
    }

    const json = await aiRes.json();
    const summary: string =
      json?.choices?.[0]?.message?.content?.toString().trim() ?? "";

    if (!summary) throw new Response("Empty summary", { status: 502 });

    await admin
      .from("job_applications")
      .update({ cv_summary: summary })
      .eq("id", data.applicationId);

    return { summary };
  });
