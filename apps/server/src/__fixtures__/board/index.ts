import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../../domain/board/IBoard.js";
import { iClientBoard } from "../../infrastructure/repositories/board/BoardRepository.js";

export const mockBoard: IBoard = {
  id: "id",
  title: "title",
  status: "public",
  created_at: "created_at",
};

export const mockClientBoard: iClientBoard = {
  id: "id",
  title: "title",
  status: "public",
  created_at: "created_at",
  board_role: "admin",
  is_favorite: false,
};

export const mockBoardDto: BoardDto = {
  id: "id",
  title: "title",
  status: "public",
  created_at: "created_at",
  board_role: "admin",
  is_favorite: true,
};

export const mockClientBoardDto: BoardDto = {
  id: "id",
  title: "title",
  status: "public",
  created_at: "created_at",
  board_role: "admin",
  is_favorite: false,
};
