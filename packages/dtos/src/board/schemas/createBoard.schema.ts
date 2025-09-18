import z from "zod";
import { boardDtoSchema } from "./boardDto.schema.js";
import { idSchema } from "../../commons/index.js";

export const createBoardRequestDto = z.object({
  user_id: idSchema,
  title: boardDtoSchema.shape.title,
  status: boardDtoSchema.shape.status,
});

export const createBoardResponseDto = z.object({
  boardDto: boardDtoSchema,
});
