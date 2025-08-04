import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../../api/domain/IBoard";

export const boardDtoMock: BoardDto = {
  id: "id",
  user_id: "user_id",
  title: "title",
  is_favorite: false,
  status: "public",
  created_at: "created_at",
  last_accessed_at: "last_accessed_at",
};

export const boardMock: IBoard = {
  id: "id",
  user_id: "user_id",
  title: "title",
  status: "public",
  isFavorite: false,
  createdAt: "created_at",
  lastAccessedAt: "last_accessed_at",
};
