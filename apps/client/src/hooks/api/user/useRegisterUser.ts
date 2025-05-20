import { useMutation } from "@tanstack/react-query";
import { RegisterFormData } from "../../../components/RegisterForm/RegisterFormValidation";
import registerUserUsecase from "../../../api/application/usecases/user/registerUserUsecase";

function useRegisterUser() {
  return useMutation({
    mutationKey: ["register-user"],
    mutationFn: ({
      data,
      accessToken,
    }: {
      data: RegisterFormData;
      accessToken: string;
    }) => registerUserUsecase(data, accessToken),
  });
}

export type RegisterUser = ReturnType<typeof useRegisterUser>["mutateAsync"];

export default useRegisterUser;
