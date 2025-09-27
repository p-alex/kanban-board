import {
  CreateBoardListRequestDto,
  CreateBoardListResponseDto,
} from "@kanban/dtos/BoardListDtoTypes";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import BoardListFactory from "../../../../domain/boardList/BoardListFactory.js";
import BoardListRepository from "../../../../infrastructure/repositories/boardList/BoardListRepository.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import BoardListTransformer from "../../../../domain/boardList/BoardListTransformer/BoardListTransformer.js";
import {
  BoardPermission,
  IsBoardActionAllowed,
} from "@kanban/shared/boardPermissions";
import CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase from "../../../../application/usecases/boardMember/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase/CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase.js";

class CreateBoardListController {
  constructor(
    private readonly _isBoardActionAllowed: CheckIfBoardMemberIsAllowedToPerformActionOnBoardUsecase,
    private readonly _boardListFactory: BoardListFactory,
    private readonly _boardListRepository: BoardListRepository,
    private readonly _boardListTransformer: BoardListTransformer,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<CreateBoardListRequestDto>
  ): Promise<IHandlerResponse<CreateBoardListResponseDto>> => {
    const user_id = httpReq.auth_user!.id;
    const boardListData = httpReq.body;

    await this._isBoardActionAllowed.execute(
      user_id,
      boardListData.board_id,
      BoardPermission.CREATE_BOARD_LIST
    );

    const newBoardList = this._boardListFactory.create({
      board_id: boardListData.board_id,
      title: boardListData.title,
      index: boardListData.index,
    });

    const createdBoardList = await this._boardListRepository.create(
      newBoardList,
      {}
    );

    const boardListDto = this._boardListTransformer.toDto(createdBoardList);

    return {
      response: this._httpResponseFactory.success(201, { boardListDto }),
    };
  };
}

export default CreateBoardListController;
