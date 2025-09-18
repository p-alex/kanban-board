import { QueryDb } from "../../../db/index.js";
import IBoardMember from "../../../domain/boardMember/IBoardMember.js";
import { RepositoryOptions } from "../index.js";

class BoardMemberRepository {
  constructor(private readonly _queryDB: QueryDb) {}

  findOne = async (
    user_id: string,
    board_id: string,
    options: RepositoryOptions
  ) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IBoardMember | undefined>(
      "SELECT * FROM board_members WHERE user_id = $1 AND board_id = $2",
      [user_id, board_id]
    );

    return result[0];
  };

  create = async (boardMember: IBoardMember, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IBoardMember>(
      "INSERT INTO board_members (user_id, board_id, role, joined_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        boardMember.user_id,
        boardMember.board_id,
        boardMember.role,
        boardMember.joined_at,
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

export default BoardMemberRepository;
