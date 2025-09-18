import z from "zod";
import { idSchema } from "../../commons/index.js";

export const markBoardAsFavoriteRequestDto = z.object({
  board_id: idSchema,
});
