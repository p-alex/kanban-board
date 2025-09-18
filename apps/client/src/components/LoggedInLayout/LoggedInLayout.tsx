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
  // const localStorage = useLocalStorage();
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

  // const [isSideBarOpen, setIsSideBarOpen] = useState(
  //   localStorage.get<boolean>("isSideBarOpen") || false
  // );

  // const toggleSideBar = () => {
  //   setIsSideBarOpen((prev) => {
  //     const nextValue = !prev;
  //     localStorage.set("isSideBarOpen", nextValue);
  //     return nextValue;
  //   });
  // };

  return (
    <>
      <Navbar logout={handleLogout} user={auth.user} />
      <div className="flex justify-end items-start">
        {/* <AnimatePresence>
          {isSideBarOpen && (
            <div data-testid="sidebar">
              <SideBar toggleSideBar={toggleSideBar} />
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!isSideBarOpen && <SideBarToggle toggleSideBar={toggleSideBar} />}
        </AnimatePresence> */}
        {/* <motion.div
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
        </motion.div> */}
        <div className="w-full">{props.children}</div>
      </div>
    </>
  );
}

export default LoggedInLayout;
