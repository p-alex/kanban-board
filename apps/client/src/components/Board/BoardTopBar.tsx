import {
  BoardPermission,
  IsBoardActionAllowed,
} from "@kanban/shared/boardPermissions";
import IBoard from "../../api/domain/IBoard";
import useMarkBoardAsFavorite from "../../api/usecases/board/MarkBoardAsFavoriteUsecase/useMarkBoardAsFavorite";
import useUnmarkBoardAsFavorite from "../../api/usecases/board/UnmarkBoardAsFavoriteUsecase/useUnmarkBoardAsFavorite";
import useUpdateBoard from "../../api/usecases/board/UpdateBoardUsecase/useUpdateBoard";
import Lock from "../../dinamicIcons/Lock/Lock";
import Star from "../../dinamicIcons/Star/Star";
import Button from "../Button/Button";
import TextWithEdit from "../TextWithEdit/TextWithEdit";

export const BOARD_TOP_BAR_TEST_ID = "boardTopBar";

interface Props {
  board: IBoard;
  isBoardActionAllowed: IsBoardActionAllowed;
}

function BoardTopBar({ board, isBoardActionAllowed }: Props) {
  const { updateBoard, isUpdateBoardLoading } = useUpdateBoard({
    boardId: board.id,
  });

  const { markBoardAsFavorite, isMarkBoardAsFavoriteLoading } =
    useMarkBoardAsFavorite({ boardId: board.id });

  const { unmarkBoardAsFavorite, isUnmarkBoardAsFavoriteLoading } =
    useUnmarkBoardAsFavorite({ boardId: board.id });

  const shouldDisableButtonsWhileLoading =
    isUpdateBoardLoading ||
    isMarkBoardAsFavoriteLoading ||
    isUnmarkBoardAsFavoriteLoading;

  const toggleFavorite = async () => {
    if (board.isFavorite) {
      await unmarkBoardAsFavorite();
    } else {
      await markBoardAsFavorite();
    }
  };

  return (
    <div
      className="backdrop-blur-md bg-(--ui_bg_lt)/85 dark:bg-(--ui_bg_dt)/85 w-full p-2 px-4 flex items-center justify-between gap-2 min-h-(--board_topBar_height)"
      data-testid={BOARD_TOP_BAR_TEST_ID}
    >
      <TextWithEdit
        callbackFunc={(title) => updateBoard({ ...board, title })}
        disabled={shouldDisableButtonsWhileLoading}
        canEdit={isBoardActionAllowed(
          board.boardRole,
          BoardPermission.UPDATE_BOARD
        )}
        maxChars={24}
        className="font-regular text-md"
      >
        {board.title}
      </TextWithEdit>

      <div className="flex items-center gap-2">
        {board.boardRole !== "guest" && (
          <Button
            icon={<Star isFull={board.isFavorite} size={24} />}
            className="w-9 h-9 flex items-center justify-center"
            title={`${
              board.isFavorite ? "Unmark" : "Mark"
            } this board as favorite`}
            onClick={toggleFavorite}
            disabled={shouldDisableButtonsWhileLoading}
          />
        )}
        {isBoardActionAllowed(
          board.boardRole,
          BoardPermission.UPDATE_BOARD
        ) && (
          <Button
            icon={<Lock isClosed={board.isPrivate} size={24} />}
            className="w-9 h-9 flex items-center justify-center"
            title={`Make this board ${
              board.isPrivate === true ? "public" : "private"
            }`}
            onClick={() =>
              updateBoard({
                ...board,
                isPrivate: !board.isPrivate,
              })
            }
            disabled={shouldDisableButtonsWhileLoading}
          />
        )}
      </div>
    </div>
  );
}

export default BoardTopBar;
