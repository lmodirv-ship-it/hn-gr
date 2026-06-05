import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  businessType: z.string().min(2).max(100),
  budget: z.string().min(1).max(60),
  extraContext: z.string().max(500).optional().default(""),
});

export interface ProjectIdea {
  title: string;
  tagline: string;
  description: string;
  targetAudience: string;
  features: string[];
  techStack: string[];
  designSuggestion: string;
  estimatedCost: string;
  estimatedTimeline: string;
  upsells: string[];
  projectType: "Website" | "E-commerce" | "Platform" | "Custom software" | "Other";
}

const SYSTEM_PROMPT = `You are HN-GROUPE's senior product strategist. The client describes their business type and budget — your job is to propose ONE concrete, exciting digital project tailored to them. Be specific, ambitious but realistic. Always respond by calling the propose_idea tool.

Rules:
- title: 3-6 words, catchy product name
- tagline: one short value proposition sentence
- description: 2-3 sentences explaining what it does and why it matters
- features: 6-9 concrete, specific features (not generic words like "auth")
- techStack: 4-6 modern technologies suitable for the budget
- designSuggestion: 1-2 sentences on visual style and UX direction
- estimatedCost: realistic USD range fitting within (or slightly above) the client's budget
- estimatedTimeline: e.g. "6-8 weeks"
- upsells: 3-4 paid add-ons HN-GROUPE could offer later (mobile app, analytics dashboard, AI module, etc.)
- projectType: one of Website, E-commerce, Platform, Custom software, Other`;

export const generateProjectIdea = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<ProjectIdea> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service is not configured");

    const userPrompt = `Business type: ${data.businessType}
Budget: ${data.budget}
${data.extraContext ? `Extra context: ${data.extraContext}` : ""}

Propose a great digital project for this client.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "propose_idea",
              description: "Return a structured project idea proposal.",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  tagline: { type: "string" },
                  description: { type: "string" },
                  targetAudience: { type: "string" },
                  features: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 10 },
                  techStack: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
                  designSuggestion: { type: "string" },
                  estimatedCost: { type: "string" },
                  estimatedTimeline: { type: "string" },
                  upsells: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
                  projectType: {
                    type: "string",
                    enum: ["Website", "E-commerce", "Platform", "Custom software", "Other"],
                  },
                },
                required: [
                  "title",
                  "tagline",
                  "description",
                  "targetAudience",
                  "features",
                  "techStack",
                  "designSuggestion",
                  "estimatedCost",
                  "estimatedTimeline",
                  "upsells",
                  "projectType",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "propose_idea" } },
      }),
    });

    if (res.status === 429) {
      throw new Error("Rate limit reached. Please wait a moment and try again.");
    }
    if (res.status === 402) {
      throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    }
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error("AI gateway error:", res.status, t);
      throw new Error("Failed to generate idea. Please try again.");
    }

    const json = await res.json();
    const args = json?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("AI returned an empty response");

    return JSON.parse(args) as ProjectIdea;
  });
