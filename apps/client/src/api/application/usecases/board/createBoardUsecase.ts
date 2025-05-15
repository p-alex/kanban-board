import { CreateNewBoardFormData } from "../../../../components/CreateNewBoardModal/CreateNewBoardValidation.js";
import { boardFactory } from "../../../domain/Board.js";
import BoardColumn, { boardColumFactory } from "../../../domain/BoardColumn.js";
import { User } from "../../../domain/User.js";
import { ServerResponse } from "../index.js";

export interface CreateBoardUsecaseArgs {
  data: CreateNewBoardFormData;
  userId: User["id"];
}

function createBoardUsecase(
  args: CreateBoardUsecaseArgs
): Promise<ServerResponse> {
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
      success: true,
      message: { shouldDisplay: false, text: "Board created!" },
    });
  });
}

export type CreateBoardUsecase = typeof createBoardUsecase;

export default createBoardUsecase;
