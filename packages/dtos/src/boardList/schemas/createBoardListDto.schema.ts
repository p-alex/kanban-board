import z from "zod";
import boardListDtoSchema from "./boardListDto.schema.js";
import { boardDtoSchema } from "../../board/schemas/boardDto.schema.js";

export const createBoardListRequestDto = z.object({
  board_id: boardDtoSchema.shape.id,
  title: boardListDtoSchema.shape.title,
  index: boardListDtoSchema.shape.index,
});

export const createBoardListResponseDto = z.object({
  boardListDto: boardListDtoSchema,
});
