import { useEffect, useState } from "react";
import { LocalStorage } from "../../hooks/useLocalStorage/useLocalStorage";
import SideBar from "../SideBar";
import { motion } from "framer-motion";
import { config } from "../../config";

interface Props {
  localStorage: LocalStorage;
  children?: React.ReactNode;
}

function LoggedInLayout(props: Props) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen((prev) => {
      const nextValue = !prev;
      props.localStorage.set("isSideBarOpen", nextValue);
      return nextValue;
    });
  };

  const setup = () => {
    const isSideBarOpen = props.localStorage.get("isSideBarOpen");
    if (isSideBarOpen === null) {
      setIsSideBarOpen(() => {
        props.localStorage.set("isSideBarOpen", true);
        return true;
      });
    } else {
      const initialIsSideBarOpen =
        props.localStorage.get<boolean>("isSideBarOpen")!;
      setIsSideBarOpen(initialIsSideBarOpen);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  return (
    <div className="flex justify-end">
      <SideBar isOpen={isSideBarOpen} toggleSideBar={toggleSideBar} />
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: isSideBarOpen ? "calc(100% - 300px)" : "100%" }}
        transition={{
          duration: config.animationDuration,
        }}
      >
        {props.children}
      </motion.div>
    </div>
  );
}

export default LoggedInLayout;
