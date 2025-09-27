import IBoardList from "../../api/domain/IBoardList";

interface Props {
  list: IBoardList;
}

function BoardList({ list }: Props) {
  return (
    <div className="p-2 rounded-(--ui_radius) bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt) flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold">{list.title}</p>
      </div>
    </div>
  );
}

export default BoardList;
