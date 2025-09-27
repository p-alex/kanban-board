import z from "zod";
import {
  createBoardListRequestDto,
  createBoardListResponseDto,
} from "../schemas/createBoardListDto.schema.js";

export type CreateBoardListRequestDto = z.infer<
  typeof createBoardListRequestDto
>;

export type CreateBoardListResponseDto = z.infer<
  typeof createBoardListResponseDto
>;
