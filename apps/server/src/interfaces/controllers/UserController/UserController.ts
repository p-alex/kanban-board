import UserService from "apps/server/src/application/services/UserService.js";
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
}

export default UserController;
