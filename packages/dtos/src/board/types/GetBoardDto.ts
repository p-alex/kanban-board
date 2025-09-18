import z from "zod";
import {
  getBoardRequestDtoSchema,
  getBoardResponseDtoSchema,
} from "../schemas/getBoard.schema.js";

export type GetBoardRequestDto = z.infer<typeof getBoardRequestDtoSchema>;
export type GetBoardResponseDto = z.infer<typeof getBoardResponseDtoSchema>;
