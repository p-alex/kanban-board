import { CryptoUtil } from "@kanban/utils";
import { cloneElement, useRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  input: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
  error?: string;
}

function TextFieldGroup({ label, input, error }: Props) {
  const id = useRef<string>(new CryptoUtil().randomUUID());

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={id.current}
          className="text-xs capitalize text-(--text_muted_lt) dark:text-(--text_muted_dt)"
        >
          {label}
        </label>
      )}
      <div
        className={`p-2 rounded-(--ui_radius) border text-sm ${
          error
            ? "border-red-500"
            : "border-(--ui_border_color_lt) dark:border-(--ui_border_color_dt)"
        } text-(--text_lt) dark:text-(--text_dt) w-full  flex items-center justify-between bg-(--ui_bg_dt)/5 dark:bg-(--ui_bg_lt)/5`}
      >
        {cloneElement(input, { id: id.current })}
      </div>
      {error && (
        <p
          className="text-red-500 font-medium text-sm capitalize shrink-0"
          data-testid={`textFieldError-${label}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default TextFieldGroup;
