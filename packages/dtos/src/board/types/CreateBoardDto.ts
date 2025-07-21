import z from "zod";
import {
  createBoardRequestDto,
  createBoardResponseDto,
} from "../schemas/createBoard.schema.js";

export type CreateBoardRequestDto = z.infer<typeof createBoardRequestDto>;
export type CreateBoardResponseDto = z.infer<typeof createBoardResponseDto>;
