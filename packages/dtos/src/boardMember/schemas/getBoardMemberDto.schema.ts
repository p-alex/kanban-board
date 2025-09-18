import z from "zod";
import boardMemberDto from "./boardMemberDto.schema.js";
import { idSchema } from "../../commons/index.js";

export const getBoardMemberRequestDto = z.object({
  board_id: idSchema,
});

export const getBoardMemberResponseDto = z.object({
  boardMemberDto: boardMemberDto,
});
