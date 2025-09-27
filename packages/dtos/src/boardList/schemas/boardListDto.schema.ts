import z from "zod";
import { idSchema } from "../../commons/index.js";
import { boardDtoSchema } from "../../board/schemas/boardDto.schema.js";

const boardListDtoSchema = z.object({
  id: idSchema,
  board_id: boardDtoSchema.shape.id,
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title can't be blank"),
  index: z.number(),
  created_at: z.string(),
});

export default boardListDtoSchema;
