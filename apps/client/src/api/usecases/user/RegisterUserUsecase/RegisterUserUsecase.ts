import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";
import BestHttpInstance from "../../../../utils/BestHttp/BestHttpInstance.js";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import BestHttpException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException.js";

class RegisterUserUsecase {
  constructor(private readonly _sendRequest: BestHttpInstance["send"]) {}

  execute = async (userData: CreateUserRequestDto) => {
    try {
      const { success, errors } = await this._sendRequest<
        ServerResponseDto<CreateUserResponseDto>,
        CreateUserRequestDto
      >("/users", { method: "post", body: userData });
      if (success) return { success, errors: [] };
      return { success: false, errors };
    } catch (error) {
      return this._handleError(error);
    }
  };

  private _handleError = (error: any) => {
    if (error instanceof BestHttpException) {
      return {
        success: false,
        errors: (error as BestHttpException<ServerResponseDto<null>>).data
          .errors,
      };
    }
    return {
      success: false,
      errors: ["Registration failed. Please try again later."],
    };
  };
}

export default RegisterUserUsecase;
