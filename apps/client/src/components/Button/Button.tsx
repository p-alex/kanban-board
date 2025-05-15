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
        "p-2 block w-full rounded-full text-center bg-(--buttonBgLightTheme) dark:bg-(--buttonBgDarkTheme) hover:bg-(--buttonHoverBgLightTheme) hover:dark:bg-(--buttonHoverBgDarkTheme) text-(--buttonTextLightTheme) dark:text-(--buttonTextDarkTheme) font-bold cursor-pointer text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ])}
      ref={ref}
    >
      {icon && icon} {children}
    </button>
  );
}

export default Button;
