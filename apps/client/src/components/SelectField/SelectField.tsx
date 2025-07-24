import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "../../icons";
import { motion, MotionNodeOptions } from "framer-motion";
import { config } from "../../config";

interface Props<TValue> {
  label: string;
  values: TValue[];
  onChange: (value: TValue) => void;
  error?: string;
}

function SelectField<TValue extends String>(props: Props<TValue>) {
  const [selectedValue, setSelectedValue] = useState(props.values[0]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  const select = (value: TValue) => {
    setSelectedValue(value);
    toggle();
  };

  const id = "select-" + props.label;

  useEffect(() => {
    props.onChange(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    if (!isOpen) return;
    const list = document.getElementById(
      `${props.label}-select-options-list`
    ) as HTMLUListElement;
    list.scrollIntoView({ behavior: "smooth" });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    toggleBtnRef.current?.focus();
  }, [isOpen]);

  return (
    <div className="relative flex flex-col gap-2">
      <label htmlFor={id} className="label">
        {props.label}
      </label>
      <div className="bg-(--ui_muted_bg_lt) dark:bg-(--ui_muted_bg_dt) w-full rounded-(--ui_radius) border border-(--ui_border_color_lt) dark:border-(--ui_border_color_dt) text-sm text-(--text_lt) dark:text-(--text_dt) capitalize flex items-center justify-between">
        <button
          onClick={toggle}
          type="button"
          className={`p-2 w-full text-left capitalize`}
          id={id}
          ref={toggleBtnRef}
        >
          {selectedValue}
        </button>
        <ChevronDown
          className={`${
            isOpen ? "rotate-180" : "rotate-0"
          } transition-transform w-6 h-6 mr-2 mt-[2px] pointer-events-none`}
        />
      </div>
      {props.error && <p className="fieldErrorMessage">{props.error}</p>}
      {isOpen && (
        <motion.ul
          {...selectListAnimation}
          id={props.label + "-select-options-list"}
          ref={ulRef}
          className="absolute top-[70px] w-full rounded-(--ui_radius) border border-(--ui_border_color_lt) dark:border-b-(--ui_border_color_dt)"
        >
          {props.values.map((value, index) => {
            return (
              <li
                key={"value-" + value + "-" + index}
                className="bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt)"
              >
                <button
                  onClick={() => select(value)}
                  type="button"
                  autoFocus={index === 0}
                  className={`border-b border-b-(--ui_border_color_dt) dark:border-b-(--ui_border_color_dt) p-2 text-(--text_lt) dark:text-(--text_dt) text-sm w-full text-left capitalize hover:bg-(--button_normal_hover_bg_lt) hover:dark:bg-(--button_normal_hover_bg_dt) ${
                    value === selectedValue
                      ? "bg-(--button_normal_hover_bg_lt)/75 dark:bg-(--button_normal_hover_bg_dt)/75"
                      : "bg-(--ui_muted_bg_lt) dark:bg-(--ui_muted_bg_dt)"
                  }`}
                >
                  {value}
                </button>
              </li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}

const selectListAnimation: MotionNodeOptions = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: config.animationDuration,
  },
};

export default SelectField;
