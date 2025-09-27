import z from "zod";
import boardListDtoSchema from "./boardListDto.schema.js";
import { boardDtoSchema } from "../../board/schemas/boardDto.schema.js";

export const getBoardListsRequestDto = z.object({
  board_id: boardDtoSchema.shape.id,
});

export const getBoardListsResponseDto = z.object({
  boardListDtos: z.array(boardListDtoSchema),
});
