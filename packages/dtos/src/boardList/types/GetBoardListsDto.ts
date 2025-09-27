import z from "zod";
import {
  getBoardListsResponseDto,
  getBoardListsRequestDto,
} from "../schemas/getBoardListsDto.schema.js";

export type GetBoardListsRequestDto = z.infer<typeof getBoardListsRequestDto>;
export type GetBoardListsResponseDto = z.infer<typeof getBoardListsResponseDto>;
