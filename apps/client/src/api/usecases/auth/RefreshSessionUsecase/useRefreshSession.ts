import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext.js";
import refreshSessionUsecase from "./index.js";

function useRefreshSession() {
  const auth = useAuthContext();

  const refresh = async () => {
    const { status, authData } = await refreshSessionUsecase.execute();

    if (authData) {
      auth.handleSetAuth(authData.user, authData.accessToken);
      return authData;
    }

    if (status === 401) {
      auth.handleResetAuth();
    }
  };

  return refresh;
}

export default useRefreshSession;
