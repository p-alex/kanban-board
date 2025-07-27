import { Link } from "react-router-dom";
import IBoard from "../../api/domain/IBoard.js";
import BoardCard from "../BoardCard/BoardCard.js";
import generateSlug from "../../utils/generateSlug.js";
import BoardCardSkeleton from "../BoardCard/BoardCardSkeleton.js";

interface Props {
  boards: IBoard[];
  isLoading: boolean;
  noItemsMessage: string;
}

function BoardCardGrid(props: Props) {
  return (
    <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {!props.isLoading &&
        props.boards.map((board) => (
          <li key={board.id}>
            <Link
              to={"/boards/" + board.title + "/" + generateSlug(board.title)}
            >
              <BoardCard board={board} />
            </Link>
          </li>
        ))}

      {!props.isLoading && props.boards.length === 0 && (
        <p>{props.noItemsMessage}</p>
      )}

      {props.isLoading &&
        new Array(12).fill(0).map((_, index) => {
          return (
            <li data-testid={"skeleton_item"} key={"skeleton_item" + index}>
              <BoardCardSkeleton key={index + "-board-card-skeleton"} />
            </li>
          );
        })}
    </ul>
  );
}

export default BoardCardGrid;
