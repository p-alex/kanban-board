import { z } from "zod";
import { userDtoSchema } from "./userDto.schema.js";
import { userSchemas } from "@kanban/schemavalidations/schemas";

export const createUserRequestDtoSchema = z.object({
  username: userSchemas.userUsernameSchema,
  email: userSchemas.userEmailSchema,
  password: userSchemas.userPasswordSchema,
});

export const createUserResponseDtoSchema = z.object({
  userDto: userDtoSchema,
});
