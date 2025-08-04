import z from "zod";
import {
  updateBoardRequestDto,
  updateBoardResponseDto,
} from "../schemas/updateBoard.schema.js";

export type UpdateBoardRequestDto = z.infer<typeof updateBoardRequestDto>;
export type UpdateBoardResponseDto = z.infer<typeof updateBoardResponseDto>;
