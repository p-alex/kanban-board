import z from "zod";
import { idSchema } from "../../commons/index.js";

export const unmarkBoardAsFavoriteRequestDto = z.object({
  board_id: idSchema,
});
