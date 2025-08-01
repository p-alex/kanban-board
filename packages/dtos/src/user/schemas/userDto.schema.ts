import { z } from "zod";
import { userSchemas } from "@kanban/schemavalidations/schemas";

export const userDtoSchema = z.object({
  id: z.string({ required_error: "User id is required" }).uuid(),
  username: userSchemas.userUsernameSchema,
});

export type UserDto = z.infer<typeof userDtoSchema>;
