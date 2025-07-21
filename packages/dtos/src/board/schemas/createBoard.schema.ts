import z from "zod";
import { boardDtoSchema } from "./boardDto.schema.js";
import { userDtoSchema } from "../../user/schemas/userDto.schema.js";

export const createBoardRequestDto = z.object({
  user_id: userDtoSchema.shape.id,
  title: boardDtoSchema.shape.title,
  status: boardDtoSchema.shape.status,
});

export const createBoardResponseDto = z.object({
  boardDto: boardDtoSchema,
});
