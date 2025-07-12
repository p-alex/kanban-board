import { IUser } from "../../api/domain/IUser";
import BigLogo from "../BigLogo/BigLogo";
import Button from "../Button/Button";

interface Props {
  logout: Function;
  user: IUser;
}

function Navbar(props: Props) {
  return (
    <div className="w-full bg-(--ui_bg_lt) dark:bg-(--ui_bg_dt) py-3 px-4 text-sm flex justify-between gap-4 items-center h-(--nav_height) border-b border-b-(--ui_border_color_lt) dark:border-b-(--ui_border_color_dt)">
      <BigLogo />
      <div className="flex items-center gap-2">
        <p className="capitalize">Welcome, {props.user.username}!</p>
        <Button onClick={() => props.logout()} className="cursor-pointer w-max">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
