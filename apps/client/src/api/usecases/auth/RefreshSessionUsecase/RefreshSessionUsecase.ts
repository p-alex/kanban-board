import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import BestHttpInstance from "../../../../utils/BestHttp/BestHttpInstance.js";
import { IUser } from "../../../domain/IUser.js";
import { DtoToUser } from "../../../dtoTransformers/dtoToUser.js";
import { RefreshSessionResponseDto } from "@kanban/dtos/AuthDtoTypes";
import BestHttpException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException.js";

export type RefreshSessionUsecaseReturn = {
  status: number;
  authData: {
    user: IUser;
    accessToken: string;
  } | null;
};

class RefreshSessionUsecase {
  constructor(
    private readonly _sendRequest: BestHttpInstance["send"],
    private readonly _dtoToUser: DtoToUser
  ) {}

  execute = async (): Promise<RefreshSessionUsecaseReturn> => {
    try {
      const { status, data, success } = await this._sendRequest<
        ServerResponseDto<RefreshSessionResponseDto>,
        undefined
      >("/auth/refresh", { method: "get", withCredentials: true });

      if (success && data) {
        return {
          status,
          authData: {
            user: this._dtoToUser(data.result.userDto),
            accessToken: data.result.newAccessToken,
          },
        };
      }

      return {
        status,
        authData: null,
      };
    } catch (error) {
      if (error instanceof BestHttpException) {
        return {
          status: error.code,
          authData: null,
        };
      }
      return {
        status: 0,
        authData: null,
      };
    }
  };
}

export default RefreshSessionUsecase;
