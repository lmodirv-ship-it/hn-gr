import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(3).max(40),
  projectType: z.enum(["Website", "E-commerce", "Platform", "Custom software", "Other"]),
  budget: z.string().min(1).max(60),
  description: z.string().min(10).max(4000),
  prefilledFromChat: z.boolean().optional().default(false),
});

/**
 * Note: The public StartProjectForm writes directly to the `project_requests`
 * table via RLS. This server function is kept as a typed RPC entry point and
 * intentionally does NOT keep an in-memory buffer of PII, and does NOT log
 * personal fields (name, email, phone) to the server console.
 */
export const submitProjectRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const id = crypto.randomUUID();
    // Log only non-sensitive metadata.
    console.log("[HN-groupe] New project request:", {
      id,
      projectType: data.projectType,
      prefilledFromChat: data.prefilledFromChat ?? false,
      createdAt: new Date().toISOString(),
    });
    return { success: true as const, id };
  });
