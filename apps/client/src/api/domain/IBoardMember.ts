import { BoardMemberDto } from "@kanban/dtos/BoardMemberDtoTypes";

interface IBoardMember {
  userId: string;
  role: BoardMemberDto["role"];
}

export default IBoardMember;
