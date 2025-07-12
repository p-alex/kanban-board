import { z } from "zod";
import { userDtoSchema } from "../../user/schemas/userDto.schema.js";

export const loginRequestDtoSchema = z.object({
  email: z.string({ required_error: "Email is required to login" }),
  password: z.string({ required_error: "Password is required to login" }),
});

export const loginResponseDtoSchema = z.object({
  userDto: userDtoSchema,
  accessToken: z.string(),
});
