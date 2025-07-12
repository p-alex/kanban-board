import { z } from "zod";
import { verificationCodeSchemas } from "@kanban/schemavalidations/schemas";

export const accountVerificationFormData = z.object({
  verificationCode: verificationCodeSchemas.verificationCodeSchema,
});

export type AccountVerificationFormData = z.infer<
  typeof accountVerificationFormData
>;
