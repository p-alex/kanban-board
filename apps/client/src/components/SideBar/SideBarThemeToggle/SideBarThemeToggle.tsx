import { MoonIcon, SunIcon } from "../../../icons";
import Switch from "../../Switch";

interface Props {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

function SideBarThemeToggle(props: Props) {
  return (
    <div className="p-3 flex items-center justify-center gap-6 bg-(--ui_muted_bg_lt) dark:bg-(--ui_muted_bg_dt) rounded-(--ui_radius) w-full text-(--text_muted_lt) dark:text-(--text_muted_dt)">
      <SunIcon />
      <Switch
        value={props.isDarkMode}
        handleChange={props.toggleTheme}
        title={`Switch to ${props.isDarkMode ? "light" : "dark"} mode`}
      />
      <MoonIcon />
    </div>
  );
}

export default SideBarThemeToggle;
