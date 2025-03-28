import { render, screen } from "@testing-library/react";
import SideBar from "./SideBar";
import userEvent from "@testing-library/user-event";

describe("SideBar.tsx", () => {
  it("click hide side bar button should call toggleSideBar", async () => {
    const toggleSideBarMock = vi.fn();

    render(<SideBar isOpen={true} toggleSideBar={toggleSideBarMock} />);

    const hideSideBarButton = screen.getByTestId("hideSideBarButton");

    await userEvent.click(hideSideBarButton);

    expect(toggleSideBarMock).toHaveBeenCalled();
  });
});
