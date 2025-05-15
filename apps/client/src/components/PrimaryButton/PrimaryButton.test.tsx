import { render, screen } from "@testing-library/react";
import PrimaryButton from "./PrimaryButton";

describe("PrimaryButton.tsx", () => {
  it("should display icon if provided", () => {
    render(<PrimaryButton icon={"Icon"}></PrimaryButton>);

    const icon = screen.getByText("Icon");

    expect(icon).toBeInTheDocument();
  });

  it("should display children", () => {
    render(<PrimaryButton>button</PrimaryButton>);

    const button = screen.getByRole("button", { name: "button" });

    expect(button).toBeInTheDocument();
  });
});
