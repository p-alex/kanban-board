import IBoard from "../../api/domain/IBoard";
import notificationCenter from "../../utils/NotificationCenter";
import BoardContent from "./BoardContent";
import BoardTopBar from "./BoardTopBar";
import { isBoardActionAllowed } from "@kanban/shared/boardPermissions";

interface Props {
  board: IBoard;
}

export interface IList {
  id: string;
  title: string;
}

export interface ICard {
  id: string;
  listId: string;
  title: string;
  cover: string;
  isDone: boolean;
}

function Board({ board }: Props) {
  return (
    <div className="h-(--board_layout_height)">
      <BoardTopBar board={board} isBoardActionAllowed={isBoardActionAllowed} />
      <BoardContent
        board={board}
        isBoardActionAllowed={isBoardActionAllowed}
        notify={notificationCenter.display}
      />
    </div>
  );
}

export default Board;
