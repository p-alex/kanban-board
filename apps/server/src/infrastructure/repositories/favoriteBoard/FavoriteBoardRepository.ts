import { QueryDb } from "../../../db/index.js";
import IBoard from "../../../domain/board/IBoard.js";
import IFavoriteBoard from "../../../domain/favoriteBoard/IFavoriteBoard.js";
import IUser from "../../../domain/user/IUser.js";
import { iClientBoard } from "../board/BoardRepository.js";
import { RepositoryOptions } from "../index.js";

class FavoriteBoardRepository {
  constructor(private readonly _queryDB: QueryDb) {}

  findOne = async (
    user_id: string,
    board_id: string,
    options: RepositoryOptions
  ) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IFavoriteBoard | undefined>(
      "SELECT * FROM favorite_boards fb where fb.user_id = $1 and fb.board_id = $2",
      [user_id, board_id]
    );

    return result[0];
  };

  create = async (
    favoriteBoard: IFavoriteBoard,
    options: RepositoryOptions
  ) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IFavoriteBoard[]>(
      "INSERT INTO favorite_boards (user_id, board_id) VALUES ($1, $2) RETURNING *",
      [favoriteBoard.user_id, favoriteBoard.board_id]
    );

    return result[0];
  };

  delete = async (
    favoriteBoard: IFavoriteBoard,
    options: RepositoryOptions
  ) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IFavoriteBoard[]>(
      "DELETE FROM favorite_boards WHERE user_id = $1 AND board_id = $2 RETURNING *",
      [favoriteBoard.user_id, favoriteBoard.board_id]
    );

    return result[0];
  };

  private getQueryFunction = (options?: RepositoryOptions) => {
    return options?.transactionQuery !== undefined
      ? options.transactionQuery
      : this._queryDB;
  };
}

export default FavoriteBoardRepository;
