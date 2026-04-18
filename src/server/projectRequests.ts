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

interface StoredRequest extends z.infer<typeof inputSchema> {
  id: string;
  createdAt: string;
}

const store: StoredRequest[] = [];

export const submitProjectRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const record: StoredRequest = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    store.push(record);
    console.log("[HN-groupe] New project request:", record);
    return { success: true as const, id: record.id };
  });
