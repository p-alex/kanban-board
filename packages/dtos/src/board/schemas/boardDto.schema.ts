import z from "zod";
import { boardMemberRoles, idSchema } from "../../commons/index.js";

export const boardDtoSchema = z.object({
  id: idSchema,
  title: z.string({ required_error: "Board title is required" }).min(1).max(24),
  is_private: z.boolean(),
  is_favorite: z.boolean(),
  board_role: z.enum(boardMemberRoles),
  created_at: z.string({ required_error: "Board created_at is required" }),
});
