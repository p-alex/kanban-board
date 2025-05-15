import { z } from "zod";
import { userSchema } from "../../api/domain/User";

export const registerFormSchema = z
  .object({
    username: userSchema.shape.username,
    email: userSchema.shape.email,
    password: userSchema.shape.password,
    confirmPassword: userSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
