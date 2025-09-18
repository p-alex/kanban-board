import { Link } from "react-router-dom";
import IBoard from "../../api/domain/IBoard";
import { ClosedLockIcon } from "../../icons";
import Star from "../../dinamicIcons/Star/Star";
import useMarkBoardAsFavorite from "../../api/usecases/board/MarkBoardAsFavoriteUsecase/useMarkBoardAsFavorite";
import useUnmarkBoardAsFavorite from "../../api/usecases/board/UnmarkBoardAsFavoriteUsecase/useUnmarkBoardAsFavorite";

interface Props {
  board: IBoard;
}

function BoardCard({ board }: Props) {
  const { markBoardAsFavorite, isMarkBoardAsFavoriteLoading } =
    useMarkBoardAsFavorite({ boardId: board.id });

  const { unmarkBoardAsFavorite, isUnmarkBoardAsFavoriteLoading } =
    useUnmarkBoardAsFavorite({ boardId: board.id });

  const toggleFavorite = async () => {
    if (board.isFavorite) {
      await unmarkBoardAsFavorite();
    } else {
      await markBoardAsFavorite();
    }
  };

  return (
    <div className="relative border border-(--ui_border_color_lt) dark:border-(--ui_border_color_dt) flex flex-col rounded-(--ui_radius) overflow-hidden">
      <div className="absolute top-0 right-0 flex items-center p-1 z-10">
        {board.status === "private" && (
          <div className="w-8 h-8 flex items-center justify-center">
            <ClosedLockIcon data-testid="lock-icon" />
          </div>
        )}
        <button
          className="relative w-8 h-8 flex items-center justify-center transition-colors z-[1] disabled:animation-fade disabled:cursor-not-allStarowed"
          title={`${board.isFavorite ? "Unmark" : "Mark"} '${
            board.title
          }' board as favorite`}
          disabled={
            isMarkBoardAsFavoriteLoading || isUnmarkBoardAsFavoriteLoading
          }
          onClick={toggleFavorite}
        >
          <Star isFull={board.isFavorite} />
        </button>
      </div>

      <Link to={`/boards/${board.id}`}>
        <div className="relative w-full bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt) h-[100px]"></div>
      </Link>

      <div className="py-2 px-4 bg-(--ui_muted_bg_lt) dark:bg-(--ui_muted_bg_dt)">
        <p>{board.title}</p>
      </div>
    </div>
  );
}

export default BoardCard;
