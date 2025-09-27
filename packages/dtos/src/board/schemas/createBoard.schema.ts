import z from "zod";
import { boardDtoSchema } from "./boardDto.schema.js";

export const createBoardRequestDto = z.object({
  title: boardDtoSchema.shape.title,
  is_private: boardDtoSchema.shape.is_private,
});

export const createBoardResponseDto = z.object({
  boardDto: boardDtoSchema,
});
