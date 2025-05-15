import { CreateNewBoardFormData } from "../../../../components/CreateNewBoardModal/CreateNewBoardValidation.js";
import { boardFactory } from "../../../domain/Board.js";
import BoardColumn, { boardColumFactory } from "../../../domain/BoardColumn.js";
import { ServerResponse } from "../index.js";

function createBoardUsecase(
  data: CreateNewBoardFormData
): Promise<ServerResponse> {
  const board = boardFactory.create({ title: data.boardTitle });

  const boardColumns: BoardColumn[] = data.boardColumns.map((column, index) =>
    boardColumFactory.create({
      boardId: board.id,
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
