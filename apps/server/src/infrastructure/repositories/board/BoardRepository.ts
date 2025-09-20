import { QueryDb } from "../../../db/index.js";
import IBoard from "../../../domain/board/IBoard.js";
import IBoardMember from "../../../domain/boardMember/IBoardMember.js";
import { RepositoryOptions } from "../index.js";

export interface iClientBoard extends IBoard {
  is_favorite: boolean;
  board_role: IBoardMember["role"];
}

class BoardRepository {
  constructor(private readonly _queryDB: QueryDb) {}

  findAllWhereMember = async (user_id: string, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<iClientBoard>(
      `
      select b.*, 
	exists(
		select 1 
		from favorite_boards fb 
		where fb.user_id = $1 
		and fb.board_id = bm.board_id
	) as is_favorite,
	(bm.user_id is not null) as is_member,
	(bm.role) as board_role
from board_members bm
left join boards b on b.id = bm.board_id
where bm.user_id = $1
`,
      [user_id]
    );

    return result;
  };

  findByIdWhereMember = async (
    user_id: string,
    board_id: string,
    options: RepositoryOptions
  ) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<iClientBoard | undefined>(
      `
        select b.*, (fb.user_id is not null) as is_favorite, coalesce(bm.role, 'viewer'::board_role) as board_role from boards b 
inner join board_members bm on bm.user_id = $1 and bm.board_id = b.id 
left join favorite_boards fb on fb.user_id = $1 and fb.board_id = bm.board_id
where b.id = $2
      `,
      [user_id, board_id]
    );

    return result[0];
  };

  findById = async (board_id: IBoard["id"], options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<iClientBoard>(
      `
      select boards.*, false as is_favorite, 'viewer'::board_role as board_role
from boards
where boards.id = $1;
      `,
      [board_id]
    );

    return result[0];
  };

  create = async (board: IBoard, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<iClientBoard>(
      "INSERT INTO boards (id, title, is_private, created_at) VALUES ($1, $2, $3, $4) RETURNING boards.*, (false) as is_favorite, ('admin') as board_role",
      [board.id, board.title, `${board.is_private}`, board.created_at]
    );

    return result[0];
  };

  update = async (updatedBoard: IBoard, options: RepositoryOptions) => {
    const queryFunc = this.getQueryFunction(options);

    const result = await queryFunc<IBoard>(
      "UPDATE boards SET title = $1, is_private = $2 WHERE id = $3 RETURNING *",
      [updatedBoard.title, `${updatedBoard.is_private}`, updatedBoard.id]
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
