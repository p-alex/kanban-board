import { Mock } from "vitest";
import useCreateBoard from "../../../api/usecases/board/CreateBoardUsecase/useCreateBoard";
import { render, screen, waitFor } from "@testing-library/react";
import CreateBoardForm from "./CreateBoardForm";
import userEvent from "@testing-library/user-event";
import useAuthContext from "../../../hooks/useAuthContext/useAuthContext";

vi.mock("../../../api/usecases/board/CreateBoardUsecase/useCreateBoard");
vi.mock("../../../hooks/useAuthContext/useAuthContext");

describe("CreateBoardForm.tsx", () => {
  let createBoard: Mock;

  beforeEach(() => {
    createBoard = vi.fn();

    (useAuthContext as Mock).mockReturnValue({
      user: { id: "c9d1efa7-93a3-42fd-910e-b7e6911e8d37" },
    });

    (useCreateBoard as Mock).mockReturnValue(createBoard);
  });

  it("should not call create board function if form is submitted with invalid data", async () => {
    render(<CreateBoardForm modalProps={{} as any} />);

    const submitBtn = screen.getByRole("button", { name: "Create board" });

    await userEvent.click(submitBtn);

    expect(createBoard).not.toHaveBeenCalled();
  });

  it("should call create board function if form is submitted with valid data", async () => {
    render(<CreateBoardForm modalProps={{} as any} />);

    const titleInput = await screen.findByLabelText("title");

    await userEvent.type(titleInput, "title");

    const submitBtn = await screen.findByRole("button", {
      name: "Create board",
    });

    await userEvent.click(submitBtn);

    expect(createBoard).toHaveBeenCalled();
  });

  it("should disable button while submitting", async () => {
    createBoard.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(null), 10000))
    );

    render(<CreateBoardForm modalProps={{} as any} />);

    const titleInput = screen.getByLabelText("title");

    await userEvent.type(titleInput, "title");

    const submitBtn = screen.getByRole("button", {
      name: "Create board",
    });

    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
  });
});
