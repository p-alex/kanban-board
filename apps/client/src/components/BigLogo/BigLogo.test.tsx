import { render, screen } from "@testing-library/react";
import BigLogo from "./BigLogo";

describe("BigLogo.tsx", () => {
  it("it should display correclty", () => {
    render(<BigLogo />);

    const logo = screen.getByRole("paragraph");

    expect(logo).toHaveTextContent("Boardly");
  });
});
