import z from "zod";
import {
  getPublicBoardRequestDto,
  getPublicBoardResponseDto,
} from "../schemas/getPublicBoard.schema.js";

export type GetPublicBoardRequestDto = z.infer<typeof getPublicBoardRequestDto>;
export type GetPublicBoardResponseDto = z.infer<
  typeof getPublicBoardResponseDto
>;
