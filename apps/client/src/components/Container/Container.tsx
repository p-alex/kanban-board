interface Props {
  children: React.ReactNode;
}

function Container(props: Props) {
  return (
    <div className="no-scrollbar relative w-full max-w-[480px] overflow-y-scroll text-black p-8 rounded-(--ui_radius) flex flex-col gap-6 bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt)">
      {props.children}
    </div>
  );
}

export default Container;
