import { z } from "zod";
import {
  loginRequestDtoSchema,
  loginResponseDtoSchema,
} from "../schemas/loginDto.schema.js";

export type LoginRequestDto = z.infer<typeof loginRequestDtoSchema>;

export type LoginResponseDto = z.infer<typeof loginResponseDtoSchema>;
