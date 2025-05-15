import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

export interface IVisibilityToggleProps {
  toggleVisibility: () => void;
  toggleRef: React.RefObject<HTMLButtonElement>;
}

export interface IVisibilityContentProps {
  toggleVisibility: () => void;
  setCanToggleOff: (value: boolean) => void;
}

interface Options {
  shouldTrapFocus: boolean;
}

interface Props {
  toggle: (toggleProps: IVisibilityToggleProps) => React.ReactNode;
  content: (contentProps: IVisibilityContentProps) => React.ReactNode;
  options?: Options;
}

function VisibilityProvider(props: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(true);

  const toggleRef = useRef<any>(undefined);

  const redirectToToggle = () => {
    toggleRef.current?.focus();
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const toggle = () => {
    if (!canClose) return;

    if (isVisible) {
      toggleVisibility();
      redirectToToggle();
    } else {
      toggleVisibility();
    }
  };

  const setCanToggleOff = (value: boolean) => {
    setCanClose(value);
  };

  return (
    <>
      {props.toggle({ toggleVisibility: toggle, toggleRef })}
      <AnimatePresence>
        {isVisible &&
          props.content({
            toggleVisibility: toggle,
            setCanToggleOff,
          })}
      </AnimatePresence>
    </>
  );
}

export default VisibilityProvider;
