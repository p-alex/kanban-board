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
        "p-2 w-full text-center bg-(--primary_color) text-white cursor-pointer text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-(--ui_radius) font-semibold flex items-center gap-1",
        className,
      ])}
      ref={ref}
    >
      {icon && icon} {children}
    </button>
  );
}

export default PrimaryButton;
