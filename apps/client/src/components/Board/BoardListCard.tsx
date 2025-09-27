import { useState } from "react";
import { ICard } from "./Board";

interface Props {
  card: ICard;
}

function BoardListCard({ card }: Props) {
  const [isDone, setIsDone] = useState(card.isDone);

  return (
    <div className=" bg-(--ui_muted_bg_lt) dark:bg-(--ui_muted_bg_dt) rounded-(--ui_radius)">
      <div className="w-full h-auto max-h-[250px] rounded-[inherit]">
        {card.cover && (
          <img
            src={card.cover}
            className="w-full h-full object-contain rounded-[inherit]"
            alt=""
            draggable="false"
          />
        )}
      </div>
      <div className="flex items-center gap-2 p-2">
        <input
          type="checkbox"
          className="w-4 h-4"
          checked={isDone}
          onChange={() => setIsDone((prev) => !prev)}
        />
        <p>{card.title}</p>
      </div>
    </div>
  );
}

export default BoardListCard;
