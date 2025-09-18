import { useState } from "react";
import { IUser } from "../../api/domain/IUser.js";
import AuthContext from "./Auth.context.js";

interface Props {
  children: React.ReactNode;
}

interface IAuth {
  user: IUser;
  accessToken: string;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const defaultAuth: IAuth = {
  user: { id: "", username: "" },
  accessToken: "",
  isLoggedIn: false,
  isLoading: false,
};

function AuthContextProvider(props: Props) {
  const [auth, setAuth] = useState<IAuth>(defaultAuth);

  const handleSetAuth = (user: IUser, accessToken: string) => {
    setAuth({ user, accessToken, isLoggedIn: true, isLoading: false });
  };

  const handleSetIsLoadingTo = (value: boolean) => {
    setAuth((prev) => ({ ...prev, isLoading: value }));
  };

  const handleResetAuth = () => {
    setAuth({
      user: { id: "", username: "" },
      accessToken: "",
      isLoggedIn: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        accessToken: auth.accessToken,
        handleSetAuth,
        handleResetAuth,
        isLoggedIn: auth.accessToken !== "",
        isLoading: auth.isLoading,
        handleSetIsLoadingTo,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
