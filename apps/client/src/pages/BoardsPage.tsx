import { useEffect, useState } from "react";
import useGetBoards from "../api/usecases/board/GetBoardsUsecase/useGetBoards";
import IBoard from "../api/domain/IBoard";
import LoggedInLayout from "../components/LoggedInLayout";
import BoardCardGrid from "../components/BoardCardGrid/BoardCardGrid";

function BoardsPage() {
  const [boards, setBoards] = useState<IBoard[]>([]);

  const { getBoards, isLoading } = useGetBoards();

  const handleSetBoards = async () => {
    const boards = await getBoards();
    setBoards(boards);
  };

  useEffect(() => {
    handleSetBoards();
  }, []);

  return (
    <LoggedInLayout>
      <div className="flex flex-col gap-6 mx-auto w-full max-w-[1200px] p-4 mt-6">
        <h2 className="text-2xl font-semibold">Your Boards</h2>
        <BoardCardGrid
          boards={boards}
          isLoading={isLoading}
          noItemsMessage="You have no boards."
        />
      </div>
    </LoggedInLayout>
  );
}

export default BoardsPage;
