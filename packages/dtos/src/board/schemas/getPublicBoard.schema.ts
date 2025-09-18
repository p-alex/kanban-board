import z from "zod";
import { idSchema } from "../../commons/index.js";
import { boardDtoSchema } from "./boardDto.schema.js";

export const getPublicBoardRequestDto = z.object({
  id: idSchema,
});

export const getPublicBoardResponseDto = z.object({
  boardDto: boardDtoSchema.nullable(),
});
