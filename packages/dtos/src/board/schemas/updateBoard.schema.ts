import z from "zod";
import { boardDtoSchema } from "./boardDto.schema.js";

export const updateBoardRequestDto = z.object({
  toUpdateBoardDto: boardDtoSchema,
});

export const updateBoardResponseDto = z.object({
  updatedBoardDto: boardDtoSchema,
});
