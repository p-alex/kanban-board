import IBoard from "../../api/domain/IBoard.js";
import BoardCard from "../BoardCard/BoardCard.js";
import BoardCardSkeleton from "../BoardCard/BoardCardSkeleton.js";

interface Props {
  boards: IBoard[];
  isLoading?: boolean;
}

export const SKELETON_CARD_TEST_ID = "skeleton_card_item";

function BoardCardGrid(props: Props) {
  return (
    <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {!props.isLoading &&
        props.boards.map((board) => (
          <li key={board.id}>
            <BoardCard board={board} />
          </li>
        ))}

      {!props.isLoading && props.boards.length === 0 && (
        <p>You have no boards.</p>
      )}

      {props.isLoading &&
        new Array(12).fill(0).map((_, index) => {
          return (
            <li
              data-testid={SKELETON_CARD_TEST_ID}
              key={"skeleton_item" + index}
            >
              <BoardCardSkeleton key={index + "-board-card-skeleton"} />
            </li>
          );
        })}
    </ul>
  );
}

export default BoardCardGrid;
