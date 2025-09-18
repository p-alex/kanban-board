import z from "zod";
import { idSchema } from "../../commons/index.js";
import { boardDtoSchema } from "./boardDto.schema.js";

export const getBoardRequestDtoSchema = z.object({
  id: idSchema,
});

export const getBoardResponseDtoSchema = z.object({
  boardDto: boardDtoSchema,
});
