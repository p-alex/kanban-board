import { MoonIcon, SunIcon } from "../../../icons";
import Switch from "../../Switch";

interface Props {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

function SideBarThemeToggle(props: Props) {
  return (
    <div className="p-3 flex items-center justify-center gap-6 bg-(--uiMutedBgLightTheme) dark:bg-(--uiMutedBgDarkTheme) rounded-md w-full text-(--textMutedLightTheme) dark:text-(--textMutedDarkTheme)">
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
