import {
  GetBoardListsRequestDto,
  GetBoardListsResponseDto,
} from "@kanban/dtos/BoardListDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import BoardListRepository from "../../../../infrastructure/repositories/boardList/BoardListRepository.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import BoardListTransformer from "../../../../domain/boardList/BoardListTransformer/BoardListTransformer.js";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import AppException from "../../../../exceptions/AppException.js";
import CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase from "../../../../application/usecases/boardMember/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase.js";
import {
  BoardPermission,
  IsBoardActionAllowed,
} from "@kanban/shared/boardPermissions";

class GetBoardListsController {
  constructor(
    private readonly _boardRepository: BoardRepository,
    private readonly _isBoardActionAllowed: IsBoardActionAllowed,
    private readonly _checkIfBoardMemberIsAllowedToPerformActionOnBoardUsecase: CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase,
    private readonly _boardListRepository: BoardListRepository,
    private readonly _boardListTransformer: BoardListTransformer,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<{}, GetBoardListsRequestDto>
  ): Promise<IHandlerResponse<GetBoardListsResponseDto>> => {
    const isUserLoggedIn = httpReq.auth_user !== null;

    const board = await this._boardRepository.findById(
      httpReq.params.board_id,
      {}
    );

    if (!board)
      throw new AppException(
        404,
        ["Board does not exist"],
        "GetBoardListsController"
      );

    if (isUserLoggedIn === false) {
      if (board.is_private)
        throw new AppException(
          403,
          ["Cannot get board lists because the board is set to private."],
          "GetBoardListsController"
        );

      const isAllowedToGetBoardLists = this._isBoardActionAllowed(
        "guest",
        BoardPermission.VIEW_BOARD
      );

      if (!isAllowedToGetBoardLists)
        throw new AppException(
          403,
          [
            `You don't have permission to perform '${BoardPermission.VIEW_BOARD}.'`,
          ],
          "GetBoardListsController"
        );

      const boardLists = await this._boardListRepository.findAll(
        httpReq.params.board_id,
        {}
      );

      return {
        response: this._httpResponseFactory.success(200, {
          boardListDtos: boardLists.map((boardList) =>
            this._boardListTransformer.toDto(boardList)
          ),
        }),
      };
    } else {
      await this._checkIfBoardMemberIsAllowedToPerformActionOnBoardUsecase.execute(
        httpReq.auth_user!.id,
        httpReq.params.board_id,
        BoardPermission.VIEW_BOARD
      );

      const boardLists = await this._boardListRepository.findAll(
        httpReq.params.board_id,
        {}
      );

      return {
        response: this._httpResponseFactory.success(200, {
          boardListDtos: boardLists.map((boardList) =>
            this._boardListTransformer.toDto(boardList)
          ),
        }),
      };
    }
  };
}

export default GetBoardListsController;
