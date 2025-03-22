import useThemeContext from "../../hooks/useThemeContext/useThemeContext";
import BigLogo from "./BigLogo";

function BigLogoContainer() {
  const { isDarkMode } = useThemeContext();

  return <BigLogo showDarkThemeVersion={isDarkMode} />;
}

export default BigLogoContainer;
