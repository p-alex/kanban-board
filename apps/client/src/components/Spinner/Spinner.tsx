interface Props {
  size: number;
}

function Spinner(props: Props) {
  return (
    <div
      data-testid="spinner"
      style={{
        width: props.size,
        height: props.size,
        borderWidth: `${props.size / 8}px`,
        borderBottomColor: "transparent",
        boxSizing: "border-box",
      }}
      className="w-10 h-10 border border-(--primary_color) rounded-[50%] animate-spin"
    ></div>
  );
}

export default Spinner;
