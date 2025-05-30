import { VerifyUserRequestDto } from "@kanban/dtos/UserDtoTypes";
import {
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/ExpressAdapter.js";
import VerifiyUserService from "../../../../application/services/user/VerifiyUserService/VerifiyUserService.js";
import { IController } from "../../index.js";

class VerifyUserController implements IController {
  constructor(private readonly _verifyUserService: VerifiyUserService) {}

  handle = async (
    httpReq: IHttpRequest<VerifyUserRequestDto>
  ): Promise<IHttpResponse<null>> => {
    const verificationCode = httpReq.body.verification_code;

    await this._verifyUserService.execute(verificationCode);

    return {
      code: 200,
      result: null,
      errors: [],
      success: true,
    };
  };
}

export default VerifyUserController;
