import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../../api/domain/IBoard";

export const boardDtoMock: BoardDto = {
  id: "id",
  title: "title",
  status: "public",
  created_at: "created_at",
  board_role: "admin",
  is_favorite: false,
};

export const boardMock: IBoard = {
  id: "id",
  title: "title",
  status: "public",
  boardRole: "admin",
  createdAt: "created_at",
  isFavorite: false,
};
