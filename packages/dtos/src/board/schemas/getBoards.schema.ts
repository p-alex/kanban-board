import z from "zod";
import { boardDtoSchema } from "./boardDto.schema.js";

export const getBoardsResponseDto = z.object({
  boardDtos: z.array(boardDtoSchema),
});
