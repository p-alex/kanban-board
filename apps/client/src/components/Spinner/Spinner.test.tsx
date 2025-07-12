import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner.tsx", () => {
  it("should apply size correclty", () => {
    render(<Spinner size={20} />);

    const spinner = screen.getByTestId("spinner");

    expect(spinner.getAttribute("style")).toContain("width: 20px");
    expect(spinner.getAttribute("style")).toContain("height: 20px");
  });
});
