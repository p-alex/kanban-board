import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import { useMutation } from "@tanstack/react-query";
import { IUsecaseResponse, UsecaseResponseFactory } from "../..";
import extractApiErrorMessage from "../../../extractApiErrorMessage";

export const LOGOUT_MUTATION_KEY = "logout";

export const LOGOUT_ERROR_MESSAGE = "Logout failed. Please try again later.";

function useLogout() {
  const http = usePrivateHttp();

  const logoutRequest = async (): Promise<IUsecaseResponse<null>> => {
    try {
      await http.post<ServerResponseDto<null>, undefined>("/auth/logout");

      return UsecaseResponseFactory.success(null);
    } catch (error) {
      const errorMessage = extractApiErrorMessage({
        error,
        defaultErrorMessage: "Failed to logout... Try again later.",
      });
      return UsecaseResponseFactory.error(errorMessage);
    }
  };

  const mutation = useMutation({
    mutationKey: [LOGOUT_MUTATION_KEY],
    mutationFn: () => logoutRequest(),
  });

  return () => mutation.mutateAsync();
}

export default useLogout;
