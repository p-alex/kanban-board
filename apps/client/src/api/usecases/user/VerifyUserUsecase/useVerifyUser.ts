import { useNavigate } from "react-router-dom";
import defaultVerifyUserUsecase from ".";
import notificationCenter from "../../../../utils/NotificationCenter";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter";
import VerifyUserUsecase from "./VerifyUserUsecase";

interface UseVerifyUserProps {
  verifyUserUsecase: VerifyUserUsecase;
  notify: NotificationCenter["display"];
}

function useVerifyUser({
  verifyUserUsecase = defaultVerifyUserUsecase,
  notify = notificationCenter.display,
}: Partial<UseVerifyUserProps> = {}) {
  const navigate = useNavigate();
  const verifyUser = async (code: string) => {
    const result = await verifyUserUsecase.execute(code);
    if (result.success) {
      notify("Account verified! You can now login.");
      navigate("/login");
      return { success: true };
    }
    notify(result.errors[0]);
    return { success: false };
  };

  return verifyUser;
}

export default useVerifyUser;
