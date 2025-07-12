import { useEffect } from "react";
import useAuthContext from "./hooks/useAuthContext/useAuthContext.js";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function RedirectIfLoggedIn(props: Props) {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate(location.state.prevLocation || "/");
    }
  }, [auth]);

  return auth.isLoggedIn ? null : props.children;
}

export default RedirectIfLoggedIn;
