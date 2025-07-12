import { z } from "zod";
import { userSchemas } from "@kanban/schemavalidations/schemas";

export const loginFormSchema = z.object({
  email: userSchemas.userEmailSchema,
  password: z.string().min(1, "Can't be blank"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
