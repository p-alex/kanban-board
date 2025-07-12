import { useContext } from "react";
import AuthContext from "../../context/AuthContext/Auth.context";

function useAuthContext() {
  const context = useContext(AuthContext);
  return context;
}

export default useAuthContext;
