import { config } from "../../config";
import { BoardIcon, HideIcon, ShowIcon } from "../../icons";
import BigLogoContainer from "../BigLogo/BigLogoContainer";
import SideBarButton from "./SideBarButton";
import SideBarButtonList from "./SideBarButtonList";
import SideBarGroup from "./SideBarGroup";
import SideBarThemeToggleContainer from "./SideBarThemeToggle/SideBarThemeToggleContainer";
import { AnimatePresence, MotionProps, motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  toggleSideBar: () => void;
}

function SideBar(props: Props) {
  return (
    <>
      <AnimatePresence>
        {props.isOpen && (
          <motion.nav
            {...slideX}
            id="site_sidebar"
            className={`fixed left-0 top-0
         bg-(--uiBgLightTheme) dark:bg-(--uiBgDarkTheme) w-[300px] h-screen border-r border-(--borderColorLightTheme) dark:border-(--borderColorDarkTheme) flex flex-col gap-6 z-100 overflow-y-scroll no-scrollbar`}
            data-testid="site_sidebar"
          >
            <div className="py-8 px-8">
              <BigLogoContainer />
            </div>
            <div className="flex flex-col justify-between h-full">
              <SideBarGroup name={"all boards (2)"}>
                <SideBarButtonList
                  buttons={[
                    <SideBarButton
                      text="Platform launch"
                      icon={<BoardIcon />}
                      isSelected
                    />,
                    <SideBarButton text="Test Board" icon={<BoardIcon />} />,
                  ]}
                />
                <SideBarButton
                  text="+ Create new board"
                  icon={<BoardIcon />}
                  className="text-(--primaryColor)"
                />
              </SideBarGroup>
              <div className="flex flex-col gap-2 mb-8">
                <div className="px-8">
                  <SideBarThemeToggleContainer />
                </div>
                <SideBarButton
                  data-testid="hideSideBarButton"
                  text="hide sidebar"
                  icon={<HideIcon />}
                  onClick={props.toggleSideBar}
                />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!props.isOpen && (
          <motion.button
            {...slideX}
            data-testid="showSideBarButton"
            onClick={props.toggleSideBar}
            className="flex left-0 items-center justify-center w-14 h-12 rounded-tr-full rounded-br-full bg-(--primaryColor) text-white fixed bottom-8 cursor-pointer z-100 hover:opacity-65 transition-opacity"
            title="show sidebar"
          >
            <ShowIcon className="mr-1" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

const slideX: MotionProps = {
  initial: { transform: "translateX(-100%)" },
  animate: { transform: "translateX(0)" },
  exit: { transform: "translateX(-100%)" },
  transition: { duration: config.animationDuration },
};

export default SideBar;
