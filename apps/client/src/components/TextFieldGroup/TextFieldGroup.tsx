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
          className="font-bold text-xs capitalize text-(--textMutedLightTheme) dark:text-(--textDarkTheme)"
        >
          {label}
        </label>
      )}
      <div
        className={`py-2 px-4 rounded-(--uiRadius) border ${
          error
            ? "border-red-500"
            : "border-(--borderColorLightTheme) dark:border-(--borderColorDarkTheme)"
        } text-(--textLightTheme) dark:text-(--textDarkTheme) w-full  flex items-center justify-between`}
      >
        {cloneElement(input, { id: id.current })}
        {error && (
          <p className="text-red-500 font-medium text-sm capitalize shrink-0">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default TextFieldGroup;
