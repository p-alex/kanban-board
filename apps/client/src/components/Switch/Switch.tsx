interface Props {
  value: boolean;
  handleChange: (value: boolean) => void;
  title: string;
}

function Switch(props: Props) {
  return (
    <button
      type="button"
      className="p-1 bg-(--primaryColor) w-10 rounded-full cursor-pointer"
      onClick={() => props.handleChange(!props.value)}
      title={props.title}
    >
      <div
        data-testid="knob"
        className={`${
          props.value ? "translate-x-[20px]" : ""
        } bg-white rounded-full w-3 h-3`}
      ></div>
    </button>
  );
}

export default Switch;
