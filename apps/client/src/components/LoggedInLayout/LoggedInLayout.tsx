import { useEffect, useState } from "react";
import { LocalStorage } from "../../hooks/useLocalStorage/useLocalStorage";
import SideBar from "../SideBar";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../config";
import { ShowIcon } from "../../icons";
import { slideX } from "../../animations";

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
    <div className="flex justify-end items-start overflow-hidden">
      <AnimatePresence>
        {isSideBarOpen && <SideBar toggleSideBar={toggleSideBar} />}
      </AnimatePresence>
      <AnimatePresence>
        {!isSideBarOpen && (
          <motion.button
            {...slideX}
            data-testid="showSideBarButton"
            onClick={toggleSideBar}
            className="flex left-0 items-center justify-center w-14 h-12 rounded-tr-full rounded-br-full bg-(--primaryColor) text-white fixed bottom-8 cursor-pointer z-100 hover:opacity-65 transition-opacity"
            title="show sidebar"
          >
            <ShowIcon className="mr-1" />
          </motion.button>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ transform: "translateX(0px)" }}
        animate={{
          transform: isSideBarOpen ? "translateX(300px)" : "translateX(0px)",
        }}
        transition={{
          duration: config.animationDuration,
        }}
        className="w-full"
      >
        {props.children}
      </motion.div>
    </div>
  );
}

export default LoggedInLayout;
