import { useMutation } from "@tanstack/react-query";
import { RegisterFormData } from "../../../components/RegisterForm/RegisterFormValidation";
import registerUserUsecase from "../../../api/application/usecases/user/registerUserUsecase";

function useRegisterUser() {
  return useMutation({
    mutationKey: ["register-user"],
    mutationFn: (data: RegisterFormData) => registerUserUsecase(data),
  });
}

export default useRegisterUser;
