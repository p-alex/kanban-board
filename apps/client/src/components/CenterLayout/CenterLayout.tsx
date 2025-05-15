interface Props {
  children: React.ReactNode;
}

function CenterLayout(props: Props) {
  return (
    <div className="no-scrollbar fixed left-0 top-0 w-full h-full flex sm:items-center justify-center p-2 items-start overflow-y-scroll">
      {props.children}
    </div>
  );
}

export default CenterLayout;
