import { render, screen } from "@testing-library/react";
import SideBarToggle from "./SideBarToggle";
import userEvent from "@testing-library/user-event";

describe("SideBarToggle.tsx", () => {
  it("should call toggle function on click", async () => {
    const toggleFn = vi.fn();

    render(<SideBarToggle toggleSideBar={toggleFn} />);

    const toggle = screen.getByRole("button");

    await userEvent.click(toggle);

    expect(toggleFn).toHaveBeenCalled();
  });
});
