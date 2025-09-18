import { useQuery } from "@tanstack/react-query";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { RefreshSessionResponseDto } from "@kanban/dtos/AuthDtoTypes";
import { IUsecaseResponse, UsecaseResponseFactory } from "../../index.js";
import extractApiErrorMessage from "../../../extractApiErrorMessage.js";
import UserTransformer from "../../../dtoTransformers/userTransformer/UserTransformer.js";
import { IUser } from "../../../domain/IUser.js";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext.js";
import { publicHttp } from "../../../index.js";

function useRefreshSession() {
  const auth = useAuthContext();
  const refreshRequest = async (): Promise<
    IUsecaseResponse<{ user: IUser; newAccessToken: string } | null>
  > => {
    try {
      const response = await publicHttp.get<
        ServerResponseDto<RefreshSessionResponseDto>
      >("/auth/refresh", { withCredentials: true });

      const user = UserTransformer.dtoToUser(response.data!.result.userDto);

      auth.handleSetAuth(user, response.data!.result.newAccessToken);

      return UsecaseResponseFactory.success({
        user,
        newAccessToken: response.data!.result.newAccessToken,
      });
    } catch (error) {
      const errorMessage = extractApiErrorMessage({
        error,
        defaultErrorMessage: "Failed to refresh session",
      });
      return UsecaseResponseFactory.error(errorMessage);
    }
  };

  const query = useQuery({
    queryKey: ["refresh-session"],
    queryFn: async () => refreshRequest(),
    retry: false,
    enabled: false,
  });

  return () => query.refetch();
}

export default useRefreshSession;
