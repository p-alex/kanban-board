import useGetBoards from "../../api/usecases/board/GetBoardsUsecase/useGetBoards";
import BoardCardGrid from "../BoardCardGrid/BoardCardGrid";
import Section from "../Section/Section";

function BoardsDashboard() {
  const { boards, favoriteBoards, isGetBoardsLoading, isGetBoardsRefeching } =
    useGetBoards();

  return (
    <>
      {favoriteBoards.length > 0 && (
        <Section title={`Favorite Boards (${favoriteBoards.length})`}>
          <BoardCardGrid boards={favoriteBoards} isLoading={false} />
        </Section>
      )}
      <Section title={`All Boards (${boards.length})`}>
        <BoardCardGrid
          boards={boards}
          isLoading={isGetBoardsLoading && !isGetBoardsRefeching}
        />
      </Section>
    </>
  );
}

export default BoardsDashboard;
