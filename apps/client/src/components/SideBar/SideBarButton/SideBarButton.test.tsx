import { render, screen } from "@testing-library/react";
import NavBarButton from "./SideBarButton";

describe("SideBarButton.tsx", () => {
  it("should display button text correctly", () => {
    render(<NavBarButton text="text" />);

    const button = screen.getByText("text");

    expect(button).toBeInTheDocument();
  });

  it("should display button icon if one is passed", () => {
    render(<NavBarButton text="text" icon={<svg data-testid="icon"></svg>} />);

    const icon = screen.getByTestId("icon");

    expect(icon).toBeInTheDocument();
  });

  it("should use default styles when button is not selected", () => {
    render(<NavBarButton text="text" isSelected={false} />);

    const button = screen.getByRole("button");

    expect(button.classList).toContain("text-(--textMutedLightTheme)");
  });

  it("should use default styles when button is selected", () => {
    render(<NavBarButton text="text" isSelected={true} />);

    const button = screen.getByRole("button");

    expect(button.classList).toContain("text-white");
    expect(button.classList).toContain("bg-(--primaryColor)");
  });
});
