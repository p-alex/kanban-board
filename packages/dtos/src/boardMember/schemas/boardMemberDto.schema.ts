import z from "zod";
import { boardMemberRoles, idSchema } from "../../commons/index.js";

const boardMemberDtoSchema = z.object({
  user_id: idSchema,
  board_id: idSchema,
  role: z.enum(boardMemberRoles),
});

export default boardMemberDtoSchema;
