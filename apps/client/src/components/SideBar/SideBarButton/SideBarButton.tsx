import { HtmlHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends HtmlHTMLAttributes<HTMLButtonElement> {
  text: string;
  ref?: React.RefObject<HTMLButtonElement> | undefined;
  icon?: React.ReactNode;
  isSelected?: boolean;
}

function SideBarButton({ text, icon, isSelected, ref, ...buttonProps }: Props) {
  const selectedColors =
    "bg-(--primary_color) text-white hover:bg-(--primary_color)/90";
  const notSelectedColors =
    "hover:bg-(--button_normal_hover_bg_lt) dark:hover:bg-(--button_normal_hover_bg_dt) text-(--button_normal_text_lt) dark:text-(--button_normal_text_dt)";
  return (
    <button
      {...buttonProps}
      className={twMerge(
        `${
          isSelected ? selectedColors : notSelectedColors
        } py-2 px-4 w-full text-left cursor-pointer flex items-center gap-2 capitalize transition-colors text-sm`,
        buttonProps.className
      )}
      ref={ref}
    >
      {icon && icon}
      {text}
    </button>
  );
}

export default SideBarButton;
