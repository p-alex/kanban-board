import { z } from "zod";
import { userSchemas } from "@kanban/schemavalidations/schemas";

export const registerFormSchema = z
  .object({
    username: userSchemas.userUsernameSchema,
    email: userSchemas.userEmailSchema,
    password: userSchemas.userPasswordSchema,
    confirmPassword: userSchemas.userPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
