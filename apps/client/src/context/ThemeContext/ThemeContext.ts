import { createContext } from "react";

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDarkMode: false,
  /* v8 ignore next */
  toggleTheme: () => {},
});

export default ThemeContext;
