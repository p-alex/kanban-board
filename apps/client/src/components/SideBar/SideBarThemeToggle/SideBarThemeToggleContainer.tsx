import useThemeContext from "../../../hooks/useThemeContext";
import SideBarThemeToggle from "./SideBarThemeToggle";

function SideBarThemeToggleContainer() {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <SideBarThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
  );
}

export default SideBarThemeToggleContainer;
