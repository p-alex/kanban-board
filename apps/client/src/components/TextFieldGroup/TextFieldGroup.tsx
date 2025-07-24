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
        <label htmlFor={id.current} className="label">
          {label}
        </label>
      )}
      <div className={`field ${error ? "fieldError" : ""} `}>
        {cloneElement(input, { id: id.current })}
      </div>
      {error && (
        <p
          className="fieldErrorMessage"
          data-testid={`textFieldError-${label}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default TextFieldGroup;
