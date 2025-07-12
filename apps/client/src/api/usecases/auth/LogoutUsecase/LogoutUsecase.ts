import BestHttpInstance from "../../../../utils/BestHttp/BestHttpInstance";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";

class LogoutUsecase {
  constructor() {}

  execute = async (sendRequest: BestHttpInstance["send"]) => {
    try {
      const { success } = await sendRequest<ServerResponseDto<null>, undefined>(
        "/auth/logout",
        {
          method: "post",
          withCredentials: true,
        }
      );
      return { success };
    } catch (error) {
      return { success: false };
    }
  };
}

export default LogoutUsecase;
