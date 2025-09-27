import { QueryDb } from "../../../db/index.js";
import IBoard from "../../../domain/board/IBoard.js";
import IBoardList from "../../../domain/boardList/IBoardList.js";
import { RepositoryOptions } from "../index.js";

class BoardListRepository {
  constructor(private readonly _queryDB: QueryDb) {}

  findAll = async (board_id: IBoard["id"], options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IBoardList>(
      "SELECT bl.* from board_lists bl WHERE bl.board_id = $1",
      [board_id]
    );

    return result;
  };

  create = async (boardList: IBoardList, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IBoardList>(
      "INSERT INTO board_lists (id, board_id, title, index, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        boardList.id,
        boardList.board_id,
        boardList.title,
        boardList.index.toString(),
        boardList.created_at,
      ]
    );

    return result[0];
  };

  private getQueryFunction = (options?: RepositoryOptions) => {
    return options?.transactionQuery !== undefined
      ? options.transactionQuery
      : this._queryDB;
  };
}

export default BoardListRepository;
