import { useMutation } from "@tanstack/react-query";
import { http } from "../../../../utils/BestHttp/index.js";
import BestHttpInstance from "../../../../utils/BestHttp/BestHttpInstance.js";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { LoginRequestDto, LoginResponseDto } from "@kanban/dtos/AuthDtoTypes";
import { IUser } from "../../../domain/IUser.js";
import extractApiErrorMessage from "../../../extractApiErrorMessage.js";
import UserTransformer from "../../../dtoTransformers/userTransformer/UserTransformer.js";
import { IUsecaseResponse, UsecaseResponseFactory } from "../../index.js";

interface UseLoginProps {
  httpClient: BestHttpInstance;
}

function useLogin({ httpClient = http }: UseLoginProps) {
  const loginRequest = async (
    credentials: LoginRequestDto
  ): Promise<IUsecaseResponse<{ user: IUser; accessToken: string } | null>> => {
    try {
      const response = await httpClient.send<
        ServerResponseDto<LoginResponseDto>,
        LoginRequestDto
      >("/auth/login", {
        method: "post",
        body: credentials,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const result = response.data!.result;
      const user = UserTransformer.dtoToUser(result.userDto);
      return UsecaseResponseFactory.success({
        user,
        accessToken: result.accessToken,
      });
    } catch (error: unknown) {
      const errorMessage = extractApiErrorMessage({
        error,
        defaultErrorMessage: "Login failed... Try again later.",
      });
      return UsecaseResponseFactory.error(errorMessage);
    }
  };

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (credentials: LoginRequestDto) => loginRequest(credentials),
  });

  return (credentials: LoginRequestDto) => mutation.mutateAsync(credentials);
}

export type Login = ReturnType<typeof useLogin>;

export default useLogin;
