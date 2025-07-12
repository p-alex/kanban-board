import { VerifyUserRequestDto } from "@kanban/dtos/UserDtoTypes";
import VerifiyUserService from "../../../../application/services/user/VerifiyUserService/VerifiyUserService.js";
import { IHandler } from "../../index.js";
import { IHandlerResponse, IHttpRequest } from "../../../adapter/index.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";

class VerifyUserController implements IHandler {
  constructor(
    private readonly _verifyUserService: VerifiyUserService,
    private readonly _httpResponseFactory: HttpResponseFactory
  ) {}

  handle = async (
    httpReq: IHttpRequest<VerifyUserRequestDto>
  ): Promise<IHandlerResponse<null>> => {
    const verificationCode = httpReq.body.verification_code;

    await this._verifyUserService.execute(verificationCode);

    return {
      response: this._httpResponseFactory.success(200, null),
    };
  };
}

export default VerifyUserController;
