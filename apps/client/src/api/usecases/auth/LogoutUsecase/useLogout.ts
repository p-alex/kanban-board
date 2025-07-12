import logoutUsecase from ".";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import notificationCenter from "../../../../utils/NotificationCenter";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter";
import LogoutUsecase from "./LogoutUsecase";

interface UseLogoutProps {
  logoutReq: LogoutUsecase["execute"];
  notify: NotificationCenter["display"];
}

const ERROR_MESSAGE = "Logout failed. Please try again later.";

function useLogout({
  logoutReq = logoutUsecase.execute,
  notify = notificationCenter.display,
}: Partial<UseLogoutProps> = {}): () => Promise<void> {
  const auth = useAuthContext();
  const http = usePrivateHttp();

  const logout = async () => {
    try {
      const result = await logoutReq(http.send);

      if (result.success) {
        auth.handleResetAuth();
        notify("Logged out successfully!");
        return;
      }

      notify(ERROR_MESSAGE);
    } catch (error) {
      notify(ERROR_MESSAGE);
    }
  };

  return logout;
}

export default useLogout;
