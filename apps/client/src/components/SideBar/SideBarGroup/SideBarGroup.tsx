interface Props {
  name?: string;
  children: React.ReactNode;
}

function SideBarGroup(props: Props) {
  return (
    <div>
      {props.name && (
        <p className="text-(--textMutedLightTheme) dark-(--textMutedDarkTheme) text-xs font-bold tracking-[2.4px] px-8 mb-5 uppercase">
          {props.name}
        </p>
      )}
      {props.children}
    </div>
  );
}

export default SideBarGroup;
