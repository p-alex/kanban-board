import { BoardMemberDto } from "@kanban/dtos/BoardMemberDtoTypes";
import IBoardMember from "./IBoardMember.js";

function boardMemberToDto(boardMember: IBoardMember): BoardMemberDto {
  return {
    user_id: boardMember.user_id,
    board_id: boardMember.board_id,
    role: boardMember.role,
  };
}

export type BoardMemberToDto = typeof boardMemberToDto;

export default boardMemberToDto;
