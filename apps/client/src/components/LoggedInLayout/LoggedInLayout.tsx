import Navbar from "../Navbar/Navbar";
import useAuthContext from "../../hooks/useAuthContext/useAuthContext";
import useLogout from "../../api/usecases/auth/LogoutUsecase/useLogout";
import notificationCenter from "../../utils/NotificationCenter";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  children?: React.ReactNode;
}

function LoggedInLayout(props: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const auth = useAuthContext();
  const logout = useLogout();

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      auth.handleResetAuth();
      navigate("/login");
      queryClient.clear();
    } else {
      notificationCenter.display(response.error);
    }
  };

  return (
    <>
      <Navbar logout={handleLogout} user={auth.user} />
      <div className="flex justify-end items-start">
        <div className="w-full">{props.children}</div>
      </div>
    </>
  );
}

export default LoggedInLayout;
