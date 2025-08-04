import { Link } from "react-router-dom";
import IBoard from "../../api/domain/IBoard";
import useUpdateBoard from "../../api/usecases/board/UpdateBoardUsecase/useUpdateBoard";
import { LockIcon, StarIconFill, StarIconOutline } from "../../icons";
import generateSlug from "../../utils/generateSlug";

interface Props {
  board: IBoard;
}

function BoardCard({ board }: Props) {
  const { update, isLoading } = useUpdateBoard();

  const toggleFavorite = () => {
    update({
      ...board,
      isFavorite: !board.isFavorite,
    });
  };

  return (
    <div className="relative border border-(--ui_border_color_lt) dark:border-(--ui_border_color_dt) flex flex-col rounded-(--ui_radius)">
      <div className="absolute top-0 right-0 flex items-center p-1 z-10">
        <button
          className="relative hover:text-yellow-400 w-8 h-8 flex items-center justify-center transition-colors z-[1] disabled:animation-fade disabled:cursor-not-allowed"
          aria-label={`${board.isFavorite ? "Unmark" : "Mark"} '${
            board.title
          }' board as favorite`}
          disabled={isLoading}
          onClick={toggleFavorite}
        >
          {board.isFavorite ? (
            <StarIconFill
              className="text-yellow-400 size-6"
              data-testid="filledStar"
            />
          ) : (
            <StarIconOutline data-testid="emptyStar" className="size-6" />
          )}
        </button>
        {board.status === "private" && (
          <div className="w-8 h-8 flex items-center justify-center">
            <LockIcon data-testid="lock-icon" />
          </div>
        )}
      </div>

      <Link to={`/boards/${board.id}/${generateSlug(board.title)}`}>
        <div className="relative w-full h-[160px] bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt) rounded-[inherit]"></div>
      </Link>

      <div className="p-2 bg-(--ui_muted_bg_lt) dark:bg-(--ui_muted_bg_dt)">
        <p>{board.title}</p>
      </div>
    </div>
  );
}

export default BoardCard;
