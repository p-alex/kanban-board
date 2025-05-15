import { config } from "../../config";
import { CrossIcon } from "../../icons";
import { motion } from "framer-motion";

interface Props {
  index: number;
  textField: React.ReactNode;
  removeFunc: (index: number) => void;
}

function Item(props: Props) {
  return (
    <motion.li
      layout
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: config.animationDuration }}
    >
      <div className="flex items-center gap-4">
        {props.textField}
        <button
          type="button"
          className="text-(--textMutedLightTheme) dark:text-(--textMutedDarkTheme)"
          onClick={() => props.removeFunc(props.index)}
          aria-label={`delete column number ${props.index + 1}`}
        >
          <CrossIcon />
        </button>
      </div>
    </motion.li>
  );
}

export default Item;
