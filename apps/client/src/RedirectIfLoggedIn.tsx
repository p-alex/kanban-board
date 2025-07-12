import { useEffect } from "react";
import useAuthContext from "./hooks/useAuthContext/useAuthContext.js";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function RedirectIfLoggedIn(props: Props) {
  const auth = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate("/");
    }
  }, [auth]);

  return auth.isLoggedIn ? null : props.children;
}

export default RedirectIfLoggedIn;
