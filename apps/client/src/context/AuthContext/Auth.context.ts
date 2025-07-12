import { createContext } from "react";
import { IUser } from "../../api/domain/IUser.js";

export interface IAuthContext {
  user: IUser;
  accessToken: string;
  handleSetAuth: (user: IUser, accessToken: string) => void;
  handleResetAuth: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  handleSetIsLoadingTo: (value: boolean) => void;
}

const AuthContext = createContext<IAuthContext>({
  user: { id: "", username: "" },
  accessToken: "",
  handleSetAuth: () => {},
  handleResetAuth: () => {},
  isLoggedIn: false,
  isLoading: false,
  handleSetIsLoadingTo: () => {},
});

export default AuthContext;
