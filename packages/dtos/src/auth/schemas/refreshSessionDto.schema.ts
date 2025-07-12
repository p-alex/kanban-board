import { z } from "zod";
import { userDtoSchema } from "../../user/schemas/userDto.schema.js";

export const refreshSessionRequestDtoSchema = z.object({});

export const refreshSessionResponseDtoSchema = z.object({
  userDto: userDtoSchema,
  newAccessToken: z.string(),
});
