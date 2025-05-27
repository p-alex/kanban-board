import { z } from "zod";
import { emailVerificationRequestDto } from "../schemas/emailVerificationDto.schema.js";

export type EmailVerificationRequestDto = z.infer<
  typeof emailVerificationRequestDto
>;
