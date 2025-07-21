import { QueryDb } from "../../../db/index.js";
import IBoard from "../../../domain/board/IBoard.js";
import { RepositoryOptions } from "../index.js";

class BoardRepository {
  constructor(private readonly _queryDB: QueryDb) {}

  findAllByUserId = async (user_id: string, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IBoard>(
      "SELECT * FROM boards WHERE user_id = $1",
      [user_id]
    );

    return result;
  };

  create = async (board: IBoard, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IBoard>(
      "INSERT INTO boards (id, user_id, title, is_favorite, status, created_at, last_accessed_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        board.id,
        board.user_id,
        board.title,
        `${board.is_favorite}`,
        board.status,
        board.created_at,
        board.last_accessed_at,
      ]
    );

    return result[0];
  };

  update = async (updatedBoard: IBoard, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IBoard>(
      "UPDATE boards SET title = $1, status = $2, is_favorite = $3 WHERE id = $4 RETURNING *",
      [updatedBoard.id]
    );

    return result[0];
  };

  delete = async (board: IBoard, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IBoard>(
      "DELETE FROM boards WHERE id = $1 RETURNING *",
      [board.id]
    );

    return result[0];
  };

  private getQueryFunction = (options?: RepositoryOptions) => {
    return options?.transactionQuery !== undefined
      ? options.transactionQuery
      : this._queryDB;
  };
}

export default BoardRepository;
