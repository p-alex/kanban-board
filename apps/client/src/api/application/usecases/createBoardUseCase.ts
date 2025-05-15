import { CreateNewBoardFormData } from "../../../components/CreateNewBoardModal/CreateNewBoardValidation";
import { boardFactory } from "../../domain/Board";
import BoardColumn, { boardColumFactory } from "../../domain/BoardColumn";

function createBoardUsecase(
  data: CreateNewBoardFormData
): Promise<{ success: boolean }> {
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
    resolve({ success: true });
  });
}

export type CreateBoardUsecase = typeof createBoardUsecase;

export default createBoardUsecase;
