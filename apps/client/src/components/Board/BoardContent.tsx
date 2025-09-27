import { useEffect, useState } from "react";
import Button from "../Button/Button";
import IBoard from "../../api/domain/IBoard";
import {
  BoardPermission,
  IsBoardActionAllowed,
} from "@kanban/shared/boardPermissions";
import useCreateBoardList from "../../api/usecases/boardList/useCreateBoardList";
import AutoResizeTextarea from "../AutoResizeTextarea/AutoResizeTextarea";
import PrimaryButton from "../PrimaryButton";
import BoardList from "./BoardList";
import useGetBoardLists from "../../api/usecases/boardList/useGetBoardLists";
import NotificationCenter from "../../utils/NotificationCenter/NotificationCenter";

interface Props {
  board: IBoard;
  isBoardActionAllowed: IsBoardActionAllowed;
  notify: NotificationCenter["display"];
}

function BoardContent({ board, isBoardActionAllowed, notify }: Props) {
  const { boardLists, getBoardListsError, isGetBoardListsLoading } =
    useGetBoardLists({
      boardId: board.id,
    });
  const [isAddingNewList, setIsAddingNewList] = useState(false);
  const [listTitle, setListTitle] = useState("");

  const { createBoardList, isCreateBoardLoading, createBoardListError } =
    useCreateBoardList({
      boardId: board.id,
    });

  useEffect(() => {
    if (getBoardListsError) notify(getBoardListsError);
  }, [getBoardListsError]);

  useEffect(() => {
    if (createBoardListError) notify(createBoardListError);
  }, [createBoardListError]);

  const handleCreateBoardList = async (event: React.FormEvent) => {
    event.preventDefault();

    if (listTitle === "") return;

    await createBoardList({
      board_id: board.id,
      index: boardLists.length,
      title: listTitle,
    });

    if (!createBoardList) return;

    setIsAddingNewList(false);
  };

  return (
    <ul className="flex items-start gap-2 p-4 overflow-scroll h-(--board_content_height)">
      {boardLists.map((list) => {
        return (
          <li className="w-[275px] shrink-0" key={list.id}>
            <BoardList list={list} />
          </li>
        );
      })}
      {!isGetBoardListsLoading && (
        <li className="w-[275px] shrink-0">
          {!isAddingNewList &&
            isBoardActionAllowed(
              board.boardRole,
              BoardPermission.CREATE_BOARD_LIST
            ) && (
              <Button
                className="text-start p-3"
                onClick={() => setIsAddingNewList(true)}
              >
                + Add a list
              </Button>
            )}
          {isAddingNewList && (
            <form
              className="flex flex-col gap-2"
              onSubmit={handleCreateBoardList}
            >
              <AutoResizeTextarea
                autoFocus
                onChange={(event) => setListTitle(event.target.value)}
              />
              <div className="flex items-center gap-2">
                <PrimaryButton
                  type="submit"
                  disabled={listTitle === "" || isCreateBoardLoading}
                >
                  Add list
                </PrimaryButton>
                <Button onClick={() => setIsAddingNewList(false)}>Close</Button>
              </div>
            </form>
          )}
        </li>
      )}
    </ul>
  );
}

export default BoardContent;
