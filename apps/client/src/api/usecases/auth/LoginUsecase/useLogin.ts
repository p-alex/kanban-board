import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext.js";
import notificationCenter from "../../../../utils/NotificationCenter/index.js";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter.js";
import loginUsecase from "./index.js";
import LoginUsecase from "./LoginUsecase.js";

interface UseLoginProps {
  login: LoginUsecase;
  notify: NotificationCenter["display"];
}

type UserData = { email: string; password: string };

function useLogin({
  login = loginUsecase,
  notify = notificationCenter.display,
}: Partial<UseLoginProps> = {}) {
  const auth = useAuthContext();

  const loginFunc = async (userData: UserData) => {
    const result = await login.execute(userData);

    if (result.authData) {
      auth.handleSetAuth(result.authData.user, result.authData.accessToken);
      return { success: true };
    }

    notify(result.error ?? "Login failed. Try again later.");
    return { success: false };
  };

  return loginFunc;
}

export type Login = ReturnType<typeof useLogin>;

export default useLogin;
