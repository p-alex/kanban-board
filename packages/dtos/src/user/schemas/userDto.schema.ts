import { z } from "zod";
import { userSchemas } from "@kanban/schemavalidations/schemas";
import { idSchema } from "../../commons/index.js";

export const userDtoSchema = z.object({
  id: idSchema,
  username: userSchemas.userUsernameSchema,
});

export type UserDto = z.infer<typeof userDtoSchema>;
