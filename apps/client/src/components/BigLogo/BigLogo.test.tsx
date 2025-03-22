import { render, screen } from "@testing-library/react";
import BigLogo from "./BigLogo";

describe("BigLogo.tsx", () => {
  it("should show dark mode version of the logo if showDarkThemeVersion is set to true", () => {
    render(<BigLogo showDarkThemeVersion={true} />);

    const logo = screen.getByRole("presentation");

    expect(logo.getAttribute("src")).toBe("./logos/logo-light.svg");
  });

  it("should show light mode version of the logo if showDarkThemeVersion is set to false", () => {
    render(<BigLogo showDarkThemeVersion={false} />);

    const logo = screen.getByRole("presentation");

    expect(logo.getAttribute("src")).toBe("./logos/logo-dark.svg");
  });
});
