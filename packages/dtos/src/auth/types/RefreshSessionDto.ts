import { z } from "zod";
import {
  refreshSessionRequestDtoSchema,
  refreshSessionResponseDtoSchema,
} from "../schemas/refreshSessionDto.schema.js";

export type RefreshSessionRequestDto = z.infer<
  typeof refreshSessionRequestDtoSchema
>;

export type RefreshSessionResponseDto = z.infer<
  typeof refreshSessionResponseDtoSchema
>;
