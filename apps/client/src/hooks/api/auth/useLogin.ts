import { useMutation } from "@tanstack/react-query";

function useLogin() {
  return useMutation({
    mutationKey: ["login"],
  });
}

export default useLogin;
