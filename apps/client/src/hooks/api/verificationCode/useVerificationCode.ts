import { useMutation } from "@tanstack/react-query";
import verifyEmailUsecase from "../../../api/application/usecases/verificationCode/verifyEmailUsecase";

function useVerificationCode() {
  return useMutation({
    mutationKey: ["email-verification"],
    mutationFn: verifyEmailUsecase,
  });
}

export default useVerificationCode;
