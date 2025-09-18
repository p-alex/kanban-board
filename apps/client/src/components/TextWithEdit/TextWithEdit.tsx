import { useEffect, useRef, useState } from "react";
import generateHexColor from "../../utils/generateHexColor/generateHexColor";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  canEdit: boolean;
  maxChars: number;
  callbackFunc: (value: string) => void;
}

function TextWithEdit({
  children,
  callbackFunc,
  canEdit = false,
  maxChars,
  ...btnProps
}: Props) {
  const [value, setValue] = useState(children);
  const [isEditMode, setIsEditMode] = useState(false);

  const inputId = useRef<string>(generateHexColor()).current;

  const toggleEditMode = () => {
    if (!canEdit) return;
    setIsEditMode((prev) => !prev);
  };

  const selectInputText = () => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input.select();
  };

  const handleChange = (value: string) => {
    setValue(value);
  };

  const executeEdit = () => {
    const isValid = validate();
    if (!isValid) {
      handleChange(children);
      toggleEditMode();
      return;
    }
    toggleEditMode();
    callbackFunc(value);
  };

  const validate = () => {
    return value.length !== 0;
  };

  useEffect(() => {
    if (isEditMode) {
      selectInputText();
    }
  }, [isEditMode]);

  return (
    <>
      {!isEditMode && (
        <button {...btnProps} onClick={toggleEditMode}>
          {value}
        </button>
      )}
      {isEditMode && (
        <form onSubmit={executeEdit} className="w-full">
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            onBlur={executeEdit}
            className={`${btnProps.className} w-full focus:border`}
            autoFocus
            maxLength={maxChars}
          />
        </form>
      )}
    </>
  );
}

export default TextWithEdit;
