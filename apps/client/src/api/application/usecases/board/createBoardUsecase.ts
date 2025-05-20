import { CreateNewBoardFormData } from "../../../../components/CreateNewBoardModal/CreateNewBoardValidation.js";
import { boardFactory } from "../../../domain/Board.js";
import BoardColumn, { boardColumFactory } from "../../../domain/BoardColumn.js";
import { IUser } from "../../../domain/User.js";
import { Response } from "../index.js";

export interface CreateBoardUsecaseArgs {
  data: CreateNewBoardFormData;
  userId: IUser["id"];
}

function createBoardUsecase(args: CreateBoardUsecaseArgs): Promise<Response> {
  const board = boardFactory.create({
    userId: args.userId,
    title: args.data.boardTitle,
  });

  const boardColumns: BoardColumn[] = args.data.boardColumns.map(
    (column, index) =>
      boardColumFactory.create({
        boardId: board.id,
        userId: args.userId,
        title: column.title,
        index,
      })
  );

  return new Promise((resolve) => {
    console.log({ board, boardColumns });
    resolve({
      code: 200,
      errors: [],
      result: { data: "data" },
      success: true,
    });
  });
}

export type CreateBoardUsecase = typeof createBoardUsecase;

export default createBoardUsecase;
