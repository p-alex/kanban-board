import { twMerge } from "tailwind-merge";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  ref?: React.RefObject<HTMLButtonElement>;
  children?: string;
}

function PrimaryButton({
  icon,
  children,
  className,
  ref,
  ...buttonProps
}: Props) {
  return (
    <button
      type="button"
      {...buttonProps}
      className={twMerge([
        "p-2 block w-full text-center bg-(--primaryColor) text-white font-bold cursor-pointer text-sm transition-opacity hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed rounded-(--buttonRadius)",
        className,
      ])}
      ref={ref}
    >
      {icon && icon} {children}
    </button>
  );
}

export default PrimaryButton;
