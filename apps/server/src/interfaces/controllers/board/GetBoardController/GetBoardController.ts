import {
  GetBoardRequestDto,
  GetBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import AppException from "../../../../exceptions/AppException.js";
import BoardTransformer from "../../../../domain/board/BoardTransformer/BoardTransformer.js";
import BoardMemberRepository from "../../../../infrastructure/repositories/boardMember/BoardMemberRepository.js";
import {
  BoardPermission,
  IsBoardActionAllowed,
} from "@kanban/shared/boardPermissions";
import FavoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/FavoriteBoardRepository.js";

class GetBoardController {
  constructor(
    private readonly _isBoardActionAllowed: IsBoardActionAllowed,
    private readonly _boardRepository: BoardRepository,
    private readonly _boardMemberRepository: BoardMemberRepository,
    private readonly _favoriteBoardRepository: FavoriteBoardRepository,
    private readonly _boardTransformer: BoardTransformer,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<any, GetBoardRequestDto>
  ): Promise<IHandlerResponse<GetBoardResponseDto>> => {
    const authUser = httpReq.auth_user;
    const board_id = httpReq.params.id;
    const board = await this._boardRepository.findById(board_id, {});

    if (!board) {
      throw new AppException(
        400,
        ["Board does not exist"],
        "GetBoardController"
      );
    }

    if (!authUser) {
      const isAllowedToGetBoard = this._isBoardActionAllowed(
        "guest",
        BoardPermission.VIEW_BOARD
      );

      if (!isAllowedToGetBoard)
        throw new AppException(
          403,
          [`You do not have permission to view the board.'`],
          "GetBoardController"
        );

      if (board.is_private)
        throw new AppException(
          403,
          [
            "This board is private. To be able to see the board, you need to become a member.",
          ],
          "GetBoardController"
        );

      return {
        response: this._httpResponseFactory.success(200, {
          boardDto: this._boardTransformer.clientBoardToDto({
            ...board,
            board_role: "guest",
            is_favorite: false,
          }),
        }),
      };
    } else {
      const boardMember = await this._boardMemberRepository.findOne(
        authUser.id,
        board_id,
        {}
      );

      const isMemberOfBoard = boardMember !== undefined;

      if (!isMemberOfBoard && board.is_private) {
        throw new AppException(
          403,
          [
            "This board is private. To see the board, you need to become a member.",
          ],
          "GetBoardController"
        );
      }

      let isAllowedToGetBoard = false;

      if (isMemberOfBoard) {
        isAllowedToGetBoard = this._isBoardActionAllowed(
          boardMember.role,
          BoardPermission.VIEW_BOARD
        );
      } else {
        isAllowedToGetBoard = this._isBoardActionAllowed(
          "guest",
          BoardPermission.VIEW_BOARD
        );
      }

      if (!isAllowedToGetBoard)
        throw new AppException(
          403,
          [
            `You do not have permission to perform '${BoardPermission.VIEW_BOARD}'`,
          ],
          "GetBoardController"
        );

      const favoriteBoard = await this._favoriteBoardRepository.findOne(
        authUser.id,
        board_id,
        {}
      );

      const isBoardFavorite = favoriteBoard !== undefined;

      return {
        response: this._httpResponseFactory.success(200, {
          boardDto: this._boardTransformer.clientBoardToDto({
            ...board,
            board_role: isMemberOfBoard ? boardMember.role : "guest",
            is_favorite: isBoardFavorite,
          }),
        }),
      };
    }
  };
}

export default GetBoardController;
