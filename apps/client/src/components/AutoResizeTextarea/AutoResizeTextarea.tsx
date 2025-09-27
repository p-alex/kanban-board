import { useEffect, useRef } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function AutoResizeTextarea({ ...textareaProps }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    textareaRef.current!.style.height = "auto";
    textareaRef.current!.style.height =
      textareaRef.current!.scrollHeight + "px";
  };

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current?.addEventListener("input", resize);

    return () => {
      textareaRef.current?.removeEventListener("input", resize);
    };
  }, []);

  return (
    <textarea
      className="w-full outline-0 outline-(--primary_color) focus:outline-2 rounded-(--ui_radius) p-2 bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt) text-(--text_lt) dark:text-(--text_dt)"
      ref={textareaRef}
      {...textareaProps}
    ></textarea>
  );
}

export default AutoResizeTextarea;
