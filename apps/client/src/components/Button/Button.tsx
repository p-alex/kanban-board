import { twMerge } from "tailwind-merge";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  ref?: React.RefObject<HTMLButtonElement>;
  children?: string;
}

function Button({ icon, children, className, ref, ...buttonProps }: Props) {
  return (
    <button
      type="button"
      {...buttonProps}
      className={twMerge([
        "p-2 block w-full text-center bg-(--button_normal_bg_lt) dark:bg-(--button_normal_bg_dt) hover:bg-(--button_normal_hover_bg_lt) hover:dark:bg-(--button_normal_hover_bg_dt) text-(--button_normal_text_lt) dark:text-(--button_normal_text_dt) font-regular cursor-pointer text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-(--ui_radius)",
        className,
      ])}
      ref={ref}
    >
      {icon && icon} {children}
    </button>
  );
}

export default Button;
