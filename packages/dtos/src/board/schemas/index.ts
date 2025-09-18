import { boardDtoSchema } from "./boardDto.schema.js";
import {
  createBoardRequestDto,
  createBoardResponseDto,
} from "./createBoard.schema.js";
import {
  getBoardRequestDtoSchema,
  getBoardResponseDtoSchema,
} from "./getBoard.schema.js";
import { getBoardsResponseDto } from "./getBoards.schema.js";
import {
  getPublicBoardRequestDto,
  getPublicBoardResponseDto,
} from "./getPublicBoard.schema.js";
import { markBoardAsFavoriteRequestDto } from "./markBoardAsFavorite.schema.js";
import { unmarkBoardAsFavoriteRequestDto } from "./unmarkBoardAsFavorite.schema.js";
import {
  updateBoardRequestDto,
  updateBoardResponseDto,
} from "./updateBoard.schema.js";
unmarkBoardAsFavoriteRequestDto;

export default {
  boardDtoSchema,
  createBoardRequestDto,
  createBoardResponseDto,
  getBoardsResponseDto,
  updateBoardRequestDto,
  updateBoardResponseDto,
  getBoardRequestDtoSchema,
  getBoardResponseDtoSchema,
  markBoardAsFavoriteRequestDto,
  getPublicBoardRequestDto,
  getPublicBoardResponseDto,
};
