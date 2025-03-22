import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

function useThemeContext() {
  const context = useContext(ThemeContext);
  return context;
}

export default useThemeContext;
