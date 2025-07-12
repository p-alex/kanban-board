import { CreateUserRequestDto } from "@kanban/dtos/UserDtoTypes";
import defaultRegisterUsecase from "./index.js";
import RegisterUsecase from "./RegisterUserUsecase.js";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter.js";
import notificationCenter from "../../../../utils/NotificationCenter/index.js";

type UseRegisterProps = {
  registerUsecase: RegisterUsecase;
  notify: NotificationCenter["display"];
};

function useRegisterUser({
  registerUsecase = defaultRegisterUsecase,
  notify = notificationCenter.display,
}: Partial<UseRegisterProps> = {}) {
  const registerUser = async (data: CreateUserRequestDto) => {
    const { success, errors } = await registerUsecase.execute(data);
    if (success) {
      notify("Account created successfully!");
      return { success };
    }
    notify(errors[0]);
    return { success };
  };

  return { registerUser };
}

export type RegisterUser = ReturnType<typeof useRegisterUser>;

export default useRegisterUser;
