import { verificationCodeSchemas } from "@kanban/schemavalidations/schemas";
import { z } from "zod";

export const emailVerificationRequestDto = z.object({
  verification_code: verificationCodeSchemas.verificationCodeSchema,
});
