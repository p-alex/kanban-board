import z from "zod";
import {
  getBoardMemberRequestDto,
  getBoardMemberResponseDto,
} from "../schemas/getBoardMemberDto.schema.js";

export type GetBoardMemberRequestDto = z.infer<typeof getBoardMemberRequestDto>;

export type GetBoardMemberResponseDto = z.infer<
  typeof getBoardMemberResponseDto
>;
