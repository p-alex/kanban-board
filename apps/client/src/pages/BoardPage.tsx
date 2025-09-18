import { useParams } from "react-router-dom";
import LoggedInLayout from "../components/LoggedInLayout";
import Board from "../components/Board/Board";
import useGetBoard from "../api/usecases/board/GetBoardUsecase/useGetBoard";
import useAuthContext from "../hooks/useAuthContext/useAuthContext";

function BoardPage() {
  const auth = useAuthContext();

  const boardId = useParams<{ id: string }>().id ?? "";

  const { board, error } = useGetBoard({ boardId });

  if (!boardId)
    return (
      <LoggedInLayout>
        <p>No board id provided</p>
      </LoggedInLayout>
    );

  if (!board)
    return (
      <LoggedInLayout>
        <p>{error}</p>
      </LoggedInLayout>
    );

  return (
    <LoggedInLayout>
      {!auth.isLoading && <Board board={board} />}
    </LoggedInLayout>
  );
}

export default BoardPage;
