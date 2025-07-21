import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../../domain/board/IBoard.js";

export const mockBoard: IBoard = {
  id: "id",
  user_id: "user_id",
  title: "title",
  status: "public",
  is_favorite: false,
  created_at: "created_at",
  last_accessed_at: "last_accessed_at",
};

export const mockBoardDto: BoardDto = {
  id: "id",
  user_id: "user_id",
  title: "title",
  status: "public",
  is_favorite: false,
  created_at: "created_at",
  last_accessed_at: "last_accessed_at",
};
