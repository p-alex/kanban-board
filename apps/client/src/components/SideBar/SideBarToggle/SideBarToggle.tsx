import { motion } from "framer-motion";
import { config } from "../../../config";
import { ChevronRight } from "../../../icons";

interface Props {
  toggleSideBar: () => void;
}

function SideBarToggle(props: Props) {
  return (
    <motion.button
      data-testid={"sideBarToggle"}
      {...sidebarToggleAnimation}
      onClick={props.toggleSideBar}
      className="group fixed h-(--sideBar_height) bottom-0 left-0 w-[20px] bg-(--ui_bg_lt)/90 dark:bg-(--ui_bg_dt)/90 backdrop-blur-lg hover:bg-(--ui_bg_lt) dark:hover:bg-(--ui_bg_dt) border-r border-(--ui_border_color_lt) dark:(--ui_border_color_dt) transition-colors"
    >
      <div className="w-7 h-7 rounded-(--ui_radius) absolute bg-(--primary_color)/90 group-hover:bg-(--primary_color) text-white flex items-center justify-center right-[-12px] top-6 transition-colors">
        <ChevronRight className="size-[16px] font-bold" />
      </div>
    </motion.button>
  );
}

const sidebarToggleAnimation = {
  initial: { transform: "translateX(-100%)" },
  animate: { transform: "translateX(0)" },
  exit: { transform: "translateX(-100%)" },
  transition: {
    duration: config.animationDuration,
    delay: config.animationDuration,
  },
};

export default SideBarToggle;
