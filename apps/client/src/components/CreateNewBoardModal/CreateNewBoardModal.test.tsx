import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddNewBoardModal from "./CreateNewBoardModal.js";
import { IVisibilityContentProps } from "../VisibilityProvider/VisibilityProvider.js";
import { CreateBoardReq } from "../../hooks/api/board/useCreateBoard.js";

async function fillFormWithValidInfo() {
  const addNewColumnBtn = screen.getByRole("button", {
    name: "+ Add New Column",
  });

  await userEvent.click(addNewColumnBtn);

  const textFields = screen.getAllByRole("textbox");

  for (let i = 0; i < textFields.length; i++) {
    await userEvent.type(textFields[i], "test");
  }
}

async function fillFormWithInvalidInfo() {
  const addNewColumnBtn = screen.getByRole("button", {
    name: "+ Add New Column",
  });

  await userEvent.click(addNewColumnBtn);
}

describe("CreateNewBoardModal.tsx", () => {
  it("should not call submit request if form is invalid", async () => {
    const submitRequestMock = vi.fn().mockResolvedValue({ success: false });
    const displayNotificationMock = vi.fn();

    render(
      <AddNewBoardModal
        displayNotification={displayNotificationMock}
        visibilityProps={
          {
            setCanToggleOff: (_: boolean) => {},
          } as IVisibilityContentProps
        }
        submitRequest={
          { mutateAsync: submitRequestMock } as unknown as CreateBoardReq
        }
      />
    );

    await fillFormWithInvalidInfo();

    const createNewBoardBtn = screen.getByRole("button", {
      name: "Create New Board",
    });

    await userEvent.click(createNewBoardBtn);

    expect(submitRequestMock).not.toHaveBeenCalled();
  });

  it("should call submit request if form is valid", async () => {
    const submitRequestMock = vi.fn().mockResolvedValue({ success: true });
    const displayNotificationMock = vi.fn();

    render(
      <AddNewBoardModal
        displayNotification={displayNotificationMock}
        visibilityProps={
          {
            setCanToggleOff: (_: boolean) => {},
            toggleVisibility: vi.fn(),
          } as IVisibilityContentProps
        }
        submitRequest={
          { mutateAsync: submitRequestMock } as unknown as CreateBoardReq
        }
      />
    );

    await fillFormWithValidInfo();

    const createNewBoardBtn = screen.getByRole("button", {
      name: "Create New Board",
    });

    await userEvent.click(createNewBoardBtn);

    expect(submitRequestMock).toHaveBeenCalled();
    expect(displayNotificationMock).toHaveBeenCalledWith("Board created!");
  });

  it("should handle successfull submit correctly", async () => {
    const submitRequestMock = vi.fn().mockResolvedValue({ success: true });
    const displayNotificationMock = vi.fn();
    const toggleVisibilityMock = vi.fn();

    render(
      <AddNewBoardModal
        displayNotification={displayNotificationMock}
        visibilityProps={
          {
            toggleVisibility: toggleVisibilityMock,
            setCanToggleOff: (_: boolean) => {},
          } as IVisibilityContentProps
        }
        submitRequest={
          { mutateAsync: submitRequestMock } as unknown as CreateBoardReq
        }
      />
    );

    await fillFormWithValidInfo();

    const createNewBoardBtn = screen.getByRole("button", {
      name: "Create New Board",
    });

    await userEvent.click(createNewBoardBtn);

    expect(toggleVisibilityMock).toHaveBeenCalled();
    expect(displayNotificationMock).toHaveBeenCalledWith("Board created!");
  });

  it("should handle failed request correctly", async () => {
    const submitRequestMock = vi.fn().mockRejectedValue({ success: false });
    const displayNotificationMock = vi.fn();
    const toggleVisibilityMock = vi.fn();

    render(
      <AddNewBoardModal
        displayNotification={displayNotificationMock}
        visibilityProps={
          {
            toggleVisibility: toggleVisibilityMock,
            setCanToggleOff: (_: boolean) => {},
          } as IVisibilityContentProps
        }
        submitRequest={
          { mutateAsync: submitRequestMock } as unknown as CreateBoardReq
        }
      />
    );

    await fillFormWithValidInfo();

    const createNewBoardBtn = screen.getByRole("button", {
      name: "Create New Board",
    });

    await userEvent.click(createNewBoardBtn);

    await expect(submitRequestMock).rejects.toThrow();
    expect(toggleVisibilityMock).not.toHaveBeenCalled();
    expect(displayNotificationMock).toHaveBeenCalledWith(
      "Failed to create the board, try again later."
    );
  });
});
