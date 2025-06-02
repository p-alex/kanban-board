import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";
import CreateUserService from "../../../../application/services/user/CreateUserService/CreateUserService.js";
import {} from "../../../adapter/ExpressAdapter/ExpressAdapter.js";
import { IController } from "../../index.js";
import { IHttpRequest, IHttpResponse } from "../../../adapter/index.js";

class CreateUserController implements IController {
  constructor(private readonly _createUserService: CreateUserService) {}

  handle = async (
    httpReq: IHttpRequest<CreateUserRequestDto>
  ): Promise<IHttpResponse<CreateUserResponseDto>> => {
    const userData = httpReq.body;

    const result = await this._createUserService.execute(userData);

    return {
      code: 201,
      success: true,
      errors: [],
      result,
    };
  };
}

export default CreateUserController;
