import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

export interface ChatSuggestion {
  projectType: string;
  shortSummary: string;
  suggestedPages: string[];
  suggestedTechStack: string[];
}

const SYSTEM_PROMPT = `You are the HN-groupe AI assistant. HN-groupe is a software & web solutions studio that builds websites, e-commerce stores, custom web platforms, and SaaS apps.

Your job: turn the client's idea into a clear, structured project proposal. Always respond by calling the propose_project tool with concise, realistic values. Keep summaries under 400 characters. Use 4-8 items in suggestedPages and 3-6 items in suggestedTechStack. projectType should be one of: "Website", "E-commerce", "Platform / Web App", "Custom software", or "Other".`;

function fallbackSuggestion(userText: string): ChatSuggestion {
  const t = userText.toLowerCase();
  if (t.includes("store") || t.includes("shop") || t.includes("ecom") || t.includes("sell")) {
    return {
      projectType: "E-commerce",
      shortSummary:
        "An online store with a polished catalog, secure checkout, and an admin dashboard to manage products and orders.",
      suggestedPages: ["Home", "Shop", "Product detail", "Cart", "Checkout", "Account", "Admin"],
      suggestedTechStack: ["Next.js", "Tailwind CSS", "Stripe", "PostgreSQL"],
    };
  }
  if (
    t.includes("platform") ||
    t.includes("saas") ||
    t.includes("dashboard") ||
    t.includes("app")
  ) {
    return {
      projectType: "Platform / Web App",
      shortSummary:
        "A custom web platform with authentication, role-based access, and a dashboard to manage core workflows.",
      suggestedPages: ["Landing", "Sign up / Login", "Dashboard", "Settings", "Admin panel"],
      suggestedTechStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    };
  }
  return {
    projectType: "Website",
    shortSummary:
      "A modern, fast company website that presents your brand, services, and converts visitors into leads.",
    suggestedPages: ["Home", "About", "Services", "Portfolio", "Blog", "Contact"],
    suggestedTechStack: ["Next.js", "Tailwind CSS", "TypeScript"],
  };
}

export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<ChatSuggestion> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    const lastUser =
      [...data.messages].reverse().find((m) => m.role === "user")?.content ?? "";

    if (!apiKey) {
      return fallbackSuggestion(lastUser);
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
          tools: [
            {
              type: "function",
              function: {
                name: "propose_project",
                description: "Return a structured project proposal for the client's idea.",
                parameters: {
                  type: "object",
                  properties: {
                    projectType: { type: "string" },
                    shortSummary: { type: "string" },
                    suggestedPages: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 3,
                      maxItems: 10,
                    },
                    suggestedTechStack: {
                      type: "array",
                      items: { type: "string" },
                      minItems: 2,
                      maxItems: 8,
                    },
                  },
                  required: [
                    "projectType",
                    "shortSummary",
                    "suggestedPages",
                    "suggestedTechStack",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "propose_project" } },
        }),
      });

      if (!res.ok) {
        console.error("AI gateway error:", res.status, await res.text().catch(() => ""));
        return fallbackSuggestion(lastUser);
      }

      const json = await res.json();
      const toolCall = json?.choices?.[0]?.message?.tool_calls?.[0];
      const args = toolCall?.function?.arguments;
      if (!args) return fallbackSuggestion(lastUser);

      const parsed = JSON.parse(args) as Partial<ChatSuggestion>;
      return {
        projectType: parsed.projectType ?? "Website",
        shortSummary: parsed.shortSummary ?? "",
        suggestedPages: Array.isArray(parsed.suggestedPages) ? parsed.suggestedPages : [],
        suggestedTechStack: Array.isArray(parsed.suggestedTechStack)
          ? parsed.suggestedTechStack
          : [],
      };
    } catch (err) {
      console.error("Chat handler failed:", err);
      return fallbackSuggestion(lastUser);
    }
  });
