import { z } from "zod";

const userPasswordSchema = z
  .string({ required_error: "Password is required." })
  .min(8, "Password must be at least 8 characters long.")
  .max(64, "Password must be at most 64 characters long.")
  .regex(/[0-9]/g, "Password must contain a number.")
  .regex(/[a-z]/g, "Password must contain a lowercase letter.")
  .regex(/[A-Z]/g, "Password must contain an uppercase letter.")
  .trim();

const userUsernameSchema = z
  .string({ required_error: "Username is required." })
  .min(2, "Username must be at least 2 characters long.")
  .max(16, "Username must be at most 16 characters long.")
  .regex(
    /^[a-zA-Z]([a-zA-Z-]+)?[a-zA-Z]$/g,
    "Username must contain only letters and hyphens (not at the start or end)."
  )
  .trim();

const userEmailSchema = z
  .string({ required_error: "Email is required." })
  .email("Email is invalid.")
  .trim();

export default { userPasswordSchema, userUsernameSchema, userEmailSchema };
