import { EmailVerificationRequestDto } from "@kanban/dtos/VerificationCodeDtoTypes";
import UserService from "../../../application/services/user/UserService.js";
import { IHttpRequest, IHttpResponse } from "../../adapter/ExpressAdapter.js";
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";

class UserController {
  constructor(private readonly _userService: UserService) {}

  create = async (
    httpReq: IHttpRequest<CreateUserRequestDto>
  ): Promise<IHttpResponse<CreateUserResponseDto>> => {
    const result = await this._userService.create(httpReq.body);

    return Promise.resolve({
      code: 201,
      result,
      success: true,
      errors: [],
    });
  };

  verifyEmail = async (
    httpReq: IHttpRequest<EmailVerificationRequestDto>
  ): Promise<IHttpResponse<null>> => {
    await this._userService.verifyEmail(httpReq.body.verification_code);

    return Promise.resolve({
      code: 200,
      result: null,
      success: true,
      errors: [],
    });
  };
}

export default UserController;
