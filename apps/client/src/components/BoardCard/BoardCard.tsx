import IBoard from "../../api/domain/IBoard";
import { LockIcon } from "../../icons";

interface Props {
  board: IBoard;
}

function BoardCard({ board }: Props) {
  return (
    <div className="border border-(--ui_border_color_lt) dark:border-(--ui_border_color_dt) flex flex-col rounded-(--ui_radius)">
      <div className="relative w-full h-[160px] bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt) rounded-[inherit]">
        {board.status === "private" && (
          <div className="absolute p-2 top-0 right-0">
            <LockIcon data-testid="lock-icon" />
          </div>
        )}
      </div>
      <div className="p-2 bg-(--ui_muted_bg_lt) dark:bg-(--ui_muted_bg_dt)">
        <p>{board.title}</p>
      </div>
    </div>
  );
}

export default BoardCard;
