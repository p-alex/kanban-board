interface Props {
  children: React.ReactNode;
}

function Container(props: Props) {
  return (
    <div className="no-scrollbar relative w-full max-w-[480px] overflow-y-scroll text-black p-8 rounded-(--uiRadius) flex flex-col gap-6 bg-(--uiBgLightTheme) dark:bg-(--uiBgDarkTheme)">
      {props.children}
    </div>
  );
}

export default Container;
