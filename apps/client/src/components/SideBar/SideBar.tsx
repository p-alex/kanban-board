import VisibilityProvider from "../VisibilityProvider";
import { BoardIcon, ChevronLeft, PlusIcon } from "../../icons";
import SideBarButton from "./SideBarButton";
import SideBarButtonList from "./SideBarButtonList";
import SideBarGroup from "./SideBarGroup";
import SideBarThemeToggleContainer from "./SideBarThemeToggle/SideBarThemeToggleContainer";
import { motion, MotionProps } from "framer-motion";
import Button from "../Button/Button";
import { config } from "../../config";

interface Props {
  toggleSideBar: () => void;
}

function SideBar(props: Props) {
  return (
    <motion.nav
      {...sidebarSlideX}
      className={`fixed left-0 bottom-0
         bg-(--ui_bg_lt)/75 dark:bg-(--ui_bg_dt)/95 w-(--sideBar_width) min-w-(--sideBar_width) h-(--sideBar_height) flex flex-col gap-6 z-10 overflow-y-scroll no-scrollbar backdrop-blur-md`}
      data-testid="loggedInSidebar"
    >
      <div className="flex flex-col justify-between h-full mt-6">
        <div className="flex flex-col">
          <div className="w-full flex justify-end px-4 mb-6">
            <Button
              className="w-max"
              icon={<ChevronLeft className="size-4" />}
              data-testid="sidebar_toggle"
              onClick={props.toggleSideBar}
            ></Button>
          </div>
          <SideBarGroup
            name={"Your boards"}
            actionBtns={
              <>
                <VisibilityProvider
                  toggle={(toggleProps) => (
                    <Button
                      onClick={toggleProps.toggleVisibility}
                      ref={toggleProps.toggleRef}
                      icon={<PlusIcon className="w-4 h-4" />}
                      data-testid="createBoardModalToggle"
                    ></Button>
                  )}
                  content={() => <div data-testid="createBoardModal"></div>}
                  options={{ shouldTrapFocus: true }}
                />
              </>
            }
          >
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
          </SideBarGroup>
        </div>
        <div className="flex flex-col gap-2 mb-8">
          <div className="px-8">
            <SideBarThemeToggleContainer />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

const sidebarSlideX: MotionProps = {
  initial: { transform: "translateX(-100%)" },
  animate: { transform: "translateX(0)" },
  exit: { transform: "translateX(-100%)" },
  transition: { duration: config.animationDuration },
};

export default SideBar;
