import TransactionManager from "../../../db/TransactionManager/TransactionManager.js";
import { BoardFactoryData } from "../../../domain/board/BoardFactory.js";
import CreateBoardUsecase from "../../usecases/board/CreateBoardUsecase/CreateBoardUsecase.js";
import CreateBoardMemberUsecase from "../../usecases/boardMember/CreateBoardMemberUsecase/CreateBoardMemberUsecase.js";

class CreateBoardService {
  constructor(
    private readonly _transactionManager: TransactionManager,
    private readonly _createBoardUsecase: CreateBoardUsecase,
    private readonly _createBoardMemberUsecase: CreateBoardMemberUsecase
  ) {}

  execute = async (boardData: BoardFactoryData, user_id: string) => {
    return await this._transactionManager.run(async (query) => {
      const newBoard = await this._createBoardUsecase.execute(boardData, query);

      await this._createBoardMemberUsecase.execute(
        {
          user_id,
          board_id: newBoard.id,
          role: "admin",
        },
        query
      );

      return newBoard;
    });
  };
}

export default CreateBoardService;
