import IBoard from "../../api/domain/IBoard";
import useGetBoards from "../../api/usecases/board/GetBoardsUsecase/useGetBoards";
import { dateUtil } from "../../utils/sharedUtils";
import BoardCardGrid from "../BoardCardGrid/BoardCardGrid";
import Section from "../Section/Section";

function BoardsDashboard() {
  const { boards, favoriteBoards, initialIsLoading } = useGetBoards();

  const sortBoardsByLastAccessedAt = (boards: IBoard[]) => {
    return boards.sort(
      (a, b) =>
        dateUtil.dateStringToMs(b.lastAccessedAt) -
        dateUtil.dateStringToMs(a.lastAccessedAt)
    );
  };

  return (
    <>
      {favoriteBoards.length > 0 && (
        <Section title={`Starred Boards (${favoriteBoards.length})`}>
          <BoardCardGrid boards={sortBoardsByLastAccessedAt(favoriteBoards)} />
        </Section>
      )}

      <Section title={`All Boards (${boards.length})`}>
        <BoardCardGrid
          boards={sortBoardsByLastAccessedAt(boards)}
          isLoading={initialIsLoading}
        />
      </Section>
    </>
  );
}

export default BoardsDashboard;
