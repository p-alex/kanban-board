import { ServerResponse } from "..";
import { LoginFormData } from "../../../../components/LoginForm/LoginFormValidation";

function loginUsecase(data: LoginFormData): Promise<ServerResponse> {
  return new Promise((resolve) => {
    console.log(data);
    resolve({
      success: true,
      message: { shouldDisplay: true, text: "Logged in!" },
    });
  });
}

export type LoginUsecase = typeof loginUsecase;

export default loginUsecase;
