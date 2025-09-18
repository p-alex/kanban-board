import { useNavigate, useParams } from "react-router-dom";
import LoggedInLayout from "../components/LoggedInLayout";
import Board from "../components/Board/Board";
import { useEffect } from "react";
import useAuthContext from "../hooks/useAuthContext/useAuthContext";
import useGetPublicBoard from "../api/usecases/board/GetPublicBoardUsecase/useGetPublicBoard";

function PublicBoardPage() {
  const auth = useAuthContext();
  const navigate = useNavigate();

  const boardId = useParams<{ id: string }>().id ?? "";

  const { board } = useGetPublicBoard({ boardId });

  useEffect(() => {
    if (auth.isLoggedIn && boardId) {
      navigate(`/boards/${boardId}`);
    }
  }, [auth.isLoggedIn, boardId, navigate]);

  if (!boardId) return <p>No board id provided</p>;
  if (!board) return <p>Board does not exist</p>;

  return (
    <LoggedInLayout>
      <Board board={board} />
    </LoggedInLayout>
  );
}

export default PublicBoardPage;
