import { FormHTMLAttributes } from "react";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

function Form(props: Props) {
  return (
    <form {...props} className="flex flex-col gap-6">
      {props.children}
    </form>
  );
}

export default Form;
