import z from "zod";
import {
  createUserRequestDtoSchema,
  createUserResponseDtoSchema,
} from "../schemas/createUserDto.schema.js";

export type CreateUserRequestDto = z.infer<typeof createUserRequestDtoSchema>;

export type CreateUserResponseDto = z.infer<typeof createUserResponseDtoSchema>;
