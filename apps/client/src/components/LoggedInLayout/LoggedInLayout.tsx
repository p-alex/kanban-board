import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage/useLocalStorage";
import SideBar from "../SideBar";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../config";
import Navbar from "../Navbar/Navbar";
import SideBarToggle from "../SideBar/SideBarToggle/SideBarToggle";
import useAuthContext from "../../hooks/useAuthContext/useAuthContext";
import useLogout from "../../api/usecases/auth/LogoutUsecase/useLogout";

interface Props {
  children?: React.ReactNode;
}

function LoggedInLayout(props: Props) {
  const localStorage = useLocalStorage();
  const auth = useAuthContext();
  const logout = useLogout();

  const [isSideBarOpen, setIsSideBarOpen] = useState(
    localStorage.get<boolean>("isSideBarOpen") || false
  );

  const toggleSideBar = () => {
    setIsSideBarOpen((prev) => {
      const nextValue = !prev;
      localStorage.set("isSideBarOpen", nextValue);
      return nextValue;
    });
  };

  return (
    <>
      <Navbar logout={logout} user={auth.user} />
      <div className="flex justify-end items-start">
        <AnimatePresence>
          {isSideBarOpen && (
            <div data-testid="sidebar">
              <SideBar toggleSideBar={toggleSideBar} />
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!isSideBarOpen && <SideBarToggle toggleSideBar={toggleSideBar} />}
        </AnimatePresence>
        <motion.div
          initial={{ width: "100%" }}
          animate={{
            width: isSideBarOpen ? "calc(100% - 300px)" : "100%",
          }}
          transition={{
            duration: config.animationDuration,
          }}
          className="w-full"
        >
          {props.children}
        </motion.div>
      </div>
    </>
  );
}

export default LoggedInLayout;
