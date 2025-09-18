import useAuthContext from "../hooks/useAuthContext/useAuthContext";
import BoardPage from "./BoardPage";
import PublicBoardPage from "./PublicBoardPage";

function BoardPageContainer() {
  const auth = useAuthContext();

  if (auth.isLoading) return null;

  return (
    <>
      {!auth.isLoading && auth.accessToken ? (
        <BoardPage />
      ) : (
        <PublicBoardPage />
      )}
    </>
  );
}

export default BoardPageContainer;
