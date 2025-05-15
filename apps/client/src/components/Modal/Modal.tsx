import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { config } from "../../config";
import FocusTrap from "../FocusTrap/FocusTrap";
import { useRef } from "react";
import { CryptoUtil } from "@kanban/utils";

interface ChildrenProps {
  firstFocusableElementClass: string;
  lastFocusableElementClass: string;
}

interface Props {
  title: string;
  toggleOff: () => void;
  content: (childrenProps: ChildrenProps) => React.ReactNode;
}

function Modal(props: Props) {
  const firstFocusableElementClass = useRef<string>(
    "first-focusable-element-" + new CryptoUtil().randomUUID()
  ).current;
  const lastFocusableElementClass = useRef<string>(
    "last-focusable-element-" + new CryptoUtil().randomUUID()
  ).current;

  return (
    <>
      {createPortal(
        <>
          <FocusTrap redirectToElementWithClass={lastFocusableElementClass} />
          <motion.div
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: config.animationDuration }}
            style={{ transform: "none" }}
            className="fixed left-0 top-0 w-screen h-screen transform-none z-[20] flex items-center justify-center p-4"
          >
            <div
              className="absolute w-full h-full left-0 top-0 bg-black opacity-50"
              data-testid="modalBackdrop"
              onClick={props.toggleOff}
            ></div>
            <div
              style={{ maxHeight: "calc(100vh - 32px)" }}
              className="no-scrollbar relative w-full max-w-[480px] overflow-y-scroll text-black p-8 rounded-(--uiRadius) flex flex-col gap-6 bg-(--uiBgLightTheme) dark:bg-(--uiBgDarkTheme)"
            >
              <h2 className="text-lg font-bold text-(--textLightTheme) dark:text-(--textDarkTheme)">
                {props.title}
              </h2>
              <div className="flex flex-col gap-6">
                {props.content({
                  firstFocusableElementClass,
                  lastFocusableElementClass,
                })}
              </div>
            </div>
          </motion.div>
          <FocusTrap redirectToElementWithClass={firstFocusableElementClass} />
        </>,
        document.body
      )}
    </>
  );
}

export default Modal;
