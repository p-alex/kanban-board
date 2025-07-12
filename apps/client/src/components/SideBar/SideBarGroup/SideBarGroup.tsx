interface Props {
  name?: string;
  actionBtns?: React.ReactNode;
  children: React.ReactNode;
}

function SideBarGroup(props: Props) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2 px-4">
        {props.name && (
          <p className="text-(--text_muted_lt) dark:text-(--text_muted_dt) font-semibold capitalize">
            {props.name}
          </p>
        )}
        <div className="flex gap-2 items-center">
          {props.actionBtns && props.actionBtns}
        </div>
      </div>
      {props.children}
    </div>
  );
}

export default SideBarGroup;
