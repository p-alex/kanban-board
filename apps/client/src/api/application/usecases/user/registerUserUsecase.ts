import { RegisterFormData } from "../../../../components/RegisterForm/RegisterFormValidation.js";
import { User, userFactory } from "../../../domain/User.js";
import { ServerResponse } from "../index.js";

function registerUserUsecase(data: RegisterFormData): Promise<ServerResponse> {
  const user: User = userFactory.create(data);

  return new Promise((resolve) => {
    console.log(user);
    resolve({
      success: true,
      message: { shouldDisplay: true, text: "Account created!" },
    });
  });
}

export type RegisterUserUsecase = typeof registerUserUsecase;

export default registerUserUsecase;
