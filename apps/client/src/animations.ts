import { MotionProps } from "framer-motion";
import { config } from "./config";

export const slideX: MotionProps = {
  initial: { transform: "translateX(-100%)" },
  animate: { transform: "translateX(0)" },
  exit: { transform: "translateX(-100%)" },
  transition: { duration: config.animationDuration },
};
