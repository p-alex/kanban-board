import { useMutation } from "@tanstack/react-query";
import loginUsecase from "../../../api/application/usecases/auth/loginUsecase";
import { LoginFormData } from "../../../components/LoginForm/LoginFormValidation";

function useLogin() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginFormData) => loginUsecase(data),
  });
}

export default useLogin;
