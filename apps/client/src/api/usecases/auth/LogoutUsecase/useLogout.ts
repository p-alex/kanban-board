import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import notificationCenter from "../../../../utils/NotificationCenter";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseLogoutProps {
  notify: NotificationCenter["display"];
}

export const LOGOUT_MUTATION_KEY = "logout";

export const LOGOUT_ERROR_MESSAGE = "Logout failed. Please try again later.";

function useLogout({
  notify = notificationCenter.display,
}: Partial<UseLogoutProps> = {}) {
  const queryClient = useQueryClient();
  const auth = useAuthContext();
  const http = usePrivateHttp();

  const mutation = useMutation({
    mutationKey: [LOGOUT_MUTATION_KEY],
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
        queryClient.removeQueries();
      }
    } catch (error) {
      notify(LOGOUT_ERROR_MESSAGE);
    }
  };

  return logout;
}

export default useLogout;
