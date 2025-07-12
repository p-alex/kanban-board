import { render, screen } from "@testing-library/react";
import SideBar from "./SideBar";
import userEvent from "@testing-library/user-event";

describe("SideBar.tsx", () => {
  it("should toggle side bar correclty", async () => {
    const toggleMock = vi.fn();

    render(<SideBar toggleSideBar={toggleMock} />);

    const toggle = screen.getByTestId("sidebar_toggle");

    await userEvent.click(toggle);

    expect(toggleMock).toHaveBeenCalled();
  });

  it("should toggle create new board modal correctly", async () => {
    render(<SideBar toggleSideBar={() => {}} />);

    const toggle = screen.getByTestId("createBoardModalToggle");

    await userEvent.click(toggle);

    const modal = screen.getByTestId("createBoardModal");

    expect(modal).toBeInTheDocument();
  });
});
