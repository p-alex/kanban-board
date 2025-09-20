import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../../api/domain/IBoard";

export const boardDtoMock: BoardDto = {
  id: "id",
  title: "title",
  is_private: false,
  created_at: "created_at",
  board_role: "admin",
  is_favorite: false,
};

export const boardMock: IBoard = {
  id: "id",
  title: "title",
  isPrivate: false,
  boardRole: "admin",
  createdAt: "created_at",
  isFavorite: false,
};
