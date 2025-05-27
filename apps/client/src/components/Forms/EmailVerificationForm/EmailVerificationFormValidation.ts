import { z } from "zod";
import { verificationCodeSchemas } from "@kanban/schemavalidations/schemas";

export const emailVerificationFormSchema = z.object({
  verificationCode: verificationCodeSchemas.verificationCodeSchema,
});

export type EmailVerificationFormData = z.infer<
  typeof emailVerificationFormSchema
>;
