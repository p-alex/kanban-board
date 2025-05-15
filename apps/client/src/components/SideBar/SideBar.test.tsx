import { render, screen } from "@testing-library/react";
import SideBar from "./SideBar";
import userEvent from "@testing-library/user-event";
import { TestComponentWrapper } from "../../testComponentWrapper";

describe("SideBar.tsx", () => {
  it("click hide side bar button should call toggleSideBar", async () => {
    const toggleSideBarMock = vi.fn();

    render(
      <TestComponentWrapper>
        <SideBar toggleSideBar={toggleSideBarMock} />
      </TestComponentWrapper>
    );

    const hideSideBarButton = screen.getByTestId("hideSideBarButton");

    await userEvent.click(hideSideBarButton);

    expect(toggleSideBarMock).toHaveBeenCalled();
  });

  it("should display a modal when clicking on create new board button", async () => {
    render(
      <TestComponentWrapper>
        <SideBar toggleSideBar={() => {}} />
      </TestComponentWrapper>
    );

    const createBoardButton = screen.getByRole("button", {
      name: "+ Create new board",
    });

    await userEvent.click(createBoardButton);

    const dialog = screen.getByRole("dialog");

    expect(dialog).toBeInTheDocument();
  });
});
