import { render, screen } from "@testing-library/react";
import SideBarThemeToggle from "./SideBarThemeToggle";

describe("SideBarThemeToggle.tsx", () => {
  it("should should apply correct title to switch button if isDarkMode prop is true", () => {
    render(<SideBarThemeToggle isDarkMode={false} toggleTheme={() => {}} />);

    const switchButton = screen.getByTitle(/switch to dark mode/i);

    expect(switchButton).toBeInTheDocument();
  });

  it("should should apply correct title to switch button if isDarkMode prop is false", () => {
    render(<SideBarThemeToggle isDarkMode={true} toggleTheme={() => {}} />);

    const switchButton = screen.getByTitle(/switch to light mode/i);

    expect(switchButton).toBeInTheDocument();
  });
});
