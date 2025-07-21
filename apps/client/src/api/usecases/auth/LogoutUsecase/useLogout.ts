import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import notificationCenter from "../../../../utils/NotificationCenter";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter";
import { useMutation } from "@tanstack/react-query";

interface UseLogoutProps {
  notify: NotificationCenter["display"];
}

export const LOGOUT_SUCCESS_MESSAGE = "Logged out successfully!";

export const LOGOUT_ERROR_MESSAGE = "Logout failed. Please try again later.";

function useLogout({
  notify = notificationCenter.display,
}: Partial<UseLogoutProps> = {}) {
  const auth = useAuthContext();
  const http = usePrivateHttp();

  const mutation = useMutation({
    mutationKey: ["logout-" + auth.user.id],
    mutationFn: () =>
      http.send<ServerResponseDto<null>, undefined>("/auth/logout", {
        method: "post",
      }),
  });

  const logout = async () => {
    try {
      const { success } = await mutation.mutateAsync();

      if (success) {
        auth.handleResetAuth();
        notify(LOGOUT_SUCCESS_MESSAGE);
      }
    } catch (error) {
      notify(LOGOUT_ERROR_MESSAGE);
    }
  };

  return logout;
}

export default useLogout;
