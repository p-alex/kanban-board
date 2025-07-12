import { LoginRequestDto, LoginResponseDto } from "@kanban/dtos/AuthDtoTypes";
import BestHttpInstance from "../../../../utils/BestHttp/BestHttpInstance";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { DtoToUser } from "../../../dtoTransformers/dtoToUser";
import { IUser } from "../../../domain/IUser";
import BestHttpResponseException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException";

type LoginUsecaseResult = {
  authData: {
    user: IUser;
    accessToken: string;
  } | null;
  error: string;
};

class LoginUsecase {
  constructor(
    private readonly _sendRequest: BestHttpInstance["send"],
    private readonly _dtoToUser: DtoToUser
  ) {}

  execute = async (userData: {
    email: string;
    password: string;
  }): Promise<LoginUsecaseResult> => {
    try {
      const { success, data, errors } = await this._sendRequest<
        ServerResponseDto<LoginResponseDto>,
        LoginRequestDto
      >("/auth/login", {
        body: userData,
        method: "post",
        withCredentials: true,
      });

      if (success && data) {
        return {
          authData: {
            user: this._dtoToUser(data.result.userDto),
            accessToken: data.result.accessToken,
          },
          error: "",
        };
      }

      return { authData: null, error: errors[0] };
    } catch (error: any) {
      return this._handleError(error);
    }
  };

  private _handleError(error: any) {
    console.error(error);
    if (error instanceof BestHttpResponseException) {
      const e = error as BestHttpResponseException<ServerResponseDto<null>>;
      return { authData: null, error: e.data.errors[0] };
    }
    return {
      authData: null,
      error: "Something went wrong. Please try again later.",
    };
  }
}

export default LoginUsecase;
