import { QueryDb } from "../../../../db/index.js";
import BoardMemberFactory, {
  BoardMemberFactoryData,
} from "../../../../domain/boardMember/BoardMemberFactory.js";
import BoardMemberRepository from "../../../../infrastructure/repositories/boardMember/BoardMemberRepository.js";

class CreateBoardMemberUsecase {
  constructor(
    private readonly _boardMemberFactory: BoardMemberFactory,
    private readonly _boardMemberRepository: BoardMemberRepository
  ) {}

  execute = async (
    data: BoardMemberFactoryData,
    transactionQuery?: QueryDb
  ) => {
    const newBoardMember = this._boardMemberFactory.create(data);

    return await this._boardMemberRepository.create(newBoardMember, {
      transactionQuery,
    });
  };
}

export default CreateBoardMemberUsecase;
