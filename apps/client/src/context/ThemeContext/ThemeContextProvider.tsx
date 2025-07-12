import { useEffect, useState } from "react";
import { LocalStorage } from "../../hooks/useLocalStorage/useLocalStorage.js";
import ThemeContext from "./Theme.context.js";

interface Props {
  localStorage: LocalStorage;
  children: React.ReactNode;
}

function ThemeContextProvider({ localStorage, children }: Props) {
  const storedTheme = localStorage.get<boolean>("isDarkMode");

  const [isDarkMode, setIsDarkMode] = useState(storedTheme ?? false);

  const toggleDarkClassOnHtmlTag = (shouldAdd: boolean) => {
    if (shouldAdd) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    localStorage.set("isDarkMode", !isDarkMode);
    toggleDarkClassOnHtmlTag(!isDarkMode);
  };

  useEffect(() => {
    const isDarkMode = localStorage.get<boolean>("isDarkMode");
    if (isDarkMode === null) {
      localStorage.set("isDarkMode", false);
      setIsDarkMode(false);
    } else {
      toggleDarkClassOnHtmlTag(isDarkMode);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContextProvider;
