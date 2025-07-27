import { render, screen } from "@testing-library/react";
import BigLogo from "./BigLogo";
import { MemoryRouter } from "react-router-dom";

describe("BigLogo.tsx", () => {
  it("it should display correclty", () => {
    render(
      <MemoryRouter>
        <BigLogo />
      </MemoryRouter>
    );

    const logo = screen.getByRole("paragraph");

    expect(logo).toHaveTextContent("Boardly");
  });
});
