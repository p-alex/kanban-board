import { render, screen } from "@testing-library/react";
import NavBarButtonList from "./SideBarButtonList";

describe("SideBarButtonList.tsx", () => {
  it("should display list items correctly", () => {
    render(
      <NavBarButtonList buttons={[<button>1</button>, <button>2</button>]} />
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(2);

    buttons.forEach((button, index) => {
      expect(button).toHaveTextContent((index + 1).toString());
    });
  });
});
