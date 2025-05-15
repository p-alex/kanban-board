import { z } from "zod";
import { BoardSchema } from "../../api/domain/Board.js";
import { BoardColumnSchema } from "../../api/domain/BoardColumn.js";

export const createNewBoardFormSchema = z.object({
  boardTitle: BoardSchema.shape.title,
  boardColumns: z.array(
    z.object({
      id: BoardColumnSchema.shape.id,
      title: BoardColumnSchema.shape.title,
    })
  ),
});

export type CreateNewBoardFormData = z.infer<typeof createNewBoardFormSchema>;
