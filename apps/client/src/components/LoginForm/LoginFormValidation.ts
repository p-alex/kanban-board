import { z } from "zod";
import { userSchema } from "../../api/domain/User";

export const loginFormSchema = z.object({
  email: userSchema.shape.email,
  password: userSchema.shape.password,
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
