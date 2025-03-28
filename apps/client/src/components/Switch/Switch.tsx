import { motion } from "framer-motion";
import { config } from "../../config";

interface Props {
  value: boolean;
  handleChange: (value: boolean) => void;
  title: string;
}

function Switch(props: Props) {
  return (
    <button
      type="button"
      className="p-1 bg-(--primaryColor) w-10 rounded-full cursor-pointer"
      onClick={() => props.handleChange(!props.value)}
      title={props.title}
    >
      <motion.div
        animate={{
          transform: props.value ? "translateX(20px)" : "none",
          transition: { duration: config.animationDuration },
        }}
        data-testid="knob"
        className={`bg-white rounded-full w-3 h-3 transition-transform`}
      ></motion.div>
    </button>
  );
}

export default Switch;
