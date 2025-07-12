import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from "@kanban/dtos/UserDtoTypes";
import CreateUserService from "../../../../application/services/user/CreateUserService/CreateUserService.js";
import { IHandler } from "../../index.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";

class CreateUserController implements IHandler {
  constructor(
    private readonly _createUserService: CreateUserService,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<CreateUserRequestDto>
  ): Promise<IHandlerResponse<CreateUserResponseDto>> => {
    const userData = httpReq.body;

    const result = await this._createUserService.execute(userData);

    return {
      response: this._httpResponseFactory.success(201, result),
    };
  };
}

export default CreateUserController;
