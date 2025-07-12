import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import BestHttpInstance from "../../../../utils/BestHttp/BestHttpInstance";
import { VerifyUserRequestDto } from "@kanban/dtos/UserDtoTypes";
import BestHttpException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException";

class VerifyUserUsecase {
  constructor(private readonly _http: BestHttpInstance) {}

  execute = async (code: string) => {
    try {
      const result = await this._http.send<
        ServerResponseDto<null>,
        VerifyUserRequestDto
      >("/users/verify", { method: "post", body: { verification_code: code } });
      if (result.success) return { success: true, errors: [] };
      return { success: false, errors: result.errors };
    } catch (error) {
      if (error instanceof BestHttpException) {
        return {
          success: false,
          errors: (error as BestHttpException<ServerResponseDto<null>>).data
            .errors,
        };
      }
      return {
        success: false,
        errors: ["Account verification failed. Please try again later."],
      };
    }
  };
}

export default VerifyUserUsecase;
