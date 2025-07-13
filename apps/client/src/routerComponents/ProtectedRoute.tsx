import { useEffect } from "react";
import useAuthContext from "../hooks/useAuthContext/useAuthContext";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute(props: Props) {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate("/login", {
        state: { prevLocation: location.pathname },
        preventScrollReset: true,
      });
    }
  }, [auth]);

  return auth.isLoggedIn ? props.children : null;
}

export default ProtectedRoute;
