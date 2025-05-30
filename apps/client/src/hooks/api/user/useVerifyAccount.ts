import { useMutation } from "@tanstack/react-query";
import verifyAccount from "../../../api/application/usecases/user/verifyAccount.js";

function useVerifyAccount() {
  return useMutation({
    mutationKey: ["account-verification"],
    mutationFn: verifyAccount,
  });
}

export default useVerifyAccount;
