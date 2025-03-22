import { CryptoUtil } from "@kanban/utils";

interface Props {
  buttons: React.ReactNode[];
}

function SideBarButtonList(props: Props) {
  return (
    <ul>
      {props.buttons.map((button) => {
        return <li key={CryptoUtil.randomUUID()}>{button}</li>;
      })}
    </ul>
  );
}

export default SideBarButtonList;
