import { render, screen } from "@testing-library/react";
import TextFieldGroup from "./TextFieldGroup";

describe("TextFieldGroup.tsx", () => {
  it("should display label", () => {
    render(<TextFieldGroup label="label" input={<input />} />);

    const label = screen.getByText("label");

    expect(label).toBeInTheDocument();
  });

  it("should display error if there is one", () => {
    render(<TextFieldGroup label="label" error="error" input={<input />} />);

    const error = screen.getByText("error");

    expect(error).toBeInTheDocument();
  });
});
