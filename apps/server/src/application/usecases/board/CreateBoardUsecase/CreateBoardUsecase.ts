import { QueryDb } from "../../../../db/index.js";
import BoardFactory, {
  BoardFactoryData,
} from "../../../../domain/board/BoardFactory.js";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";

class CreateBoardUsecase {
  constructor(
    private readonly _boardFactory: BoardFactory,
    private readonly _boardRepository: BoardRepository
  ) {}

  execute = async (data: BoardFactoryData, transactionQuery?: QueryDb) => {
    const board = this._boardFactory.create(data);

    return await this._boardRepository.create(board, { transactionQuery });
  };
}

export default CreateBoardUsecase;
