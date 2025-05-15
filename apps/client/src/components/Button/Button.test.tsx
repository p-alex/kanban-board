import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button.tsx", () => {
  it("should display icon if provided", () => {
    render(<Button icon={"Icon"}></Button>);

    const icon = screen.getByText("Icon");

    expect(icon).toBeInTheDocument();
  });

  it("should display children", () => {
    render(<Button>button</Button>);

    const button = screen.getByRole("button", { name: "button" });

    expect(button).toBeInTheDocument();
  });
});
