import { HtmlHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends HtmlHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
}

function SideBarButton({ text, icon, isSelected, ...buttonProps }: Props) {
  return (
    <button
      {...buttonProps}
      className={twMerge(
        `${
          isSelected
            ? "text-white bg-(--primaryColor)"
            : "text-(--textMutedLightTheme)"
        } py-3 px-8 rounded-tr-full rounded-br-full w-[90%] text-left cursor-pointer font-bold flex items-center gap-4 capitalize`,
        buttonProps.className
      )}
    >
      {icon && icon}
      {text}
    </button>
  );
}

export default SideBarButton;
