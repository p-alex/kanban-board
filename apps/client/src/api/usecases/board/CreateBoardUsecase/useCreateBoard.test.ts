import { useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext.js";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp.js";
import { useMutation } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import useCreateBoard from "./useCreateBoard.js";
import { CreateBoardRequestDto } from "@kanban/dtos/BoardDtoTypes";
import BestHttpResponseException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException.js";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";

vi.mock("react-router-dom");
vi.mock("../../../../hooks/useAuthContext/useAuthContext.js");
vi.mock("../../../../hooks/usePrivateHttp/usePrivateHttp.js");
vi.mock("@tanstack/react-query");

describe("useCreateBoard.ts", () => {
  let navigate: Mock;
  let sendFn: Mock;
  let notify: Mock;

  const userId = "userid";

  const data: CreateBoardRequestDto = {
    title: "title",
    status: "public",
    user_id: "user_id",
  };

  beforeEach(() => {
    navigate = vi.fn();
    sendFn = vi.fn();
    notify = vi.fn();

    (useNavigate as Mock).mockReturnValue(navigate);

    (useAuthContext as Mock).mockReturnValue({
      user: { id: userId },
    });

    (usePrivateHttp as Mock).mockReturnValue({ post: sendFn });

    (useMutation as Mock).mockImplementation(({ mutationFn }) => ({
      mutateAsync: vi.fn().mockImplementation(() => mutationFn(data)),
    }));
  });

  it("should call useMutation with correct arguments", async () => {
    const { result } = renderHook(() => useCreateBoard());
    await result.current.createBoard(data);
    const calledOptions = (useMutation as Mock).mock.calls[0][0];
    expect(calledOptions.mutationKey).toEqual(["create-board-" + userId]);
    expect(typeof calledOptions.mutationFn).toBe("function");
  });

  it("should call request send function with correct arguments", async () => {
    const { result } = renderHook(() => useCreateBoard());
    await result.current.createBoard(data);
    expect(sendFn).toHaveBeenCalledWith("/boards", data);
  });

  describe("on success", () => {
    it("should notify the user", async () => {
      sendFn.mockResolvedValue({
        data: { success: true, result: { boardDto: { id: "id" } } },
      });
      const { result } = renderHook(() => useCreateBoard({ notify }));
      await result.current.createBoard(data);
      expect(notify).toHaveBeenCalledWith("Board created!");
    });

    it("should navigate to /boards/:id", async () => {
      sendFn.mockResolvedValue({
        data: {
          success: true,
          result: { boardDto: { id: "id", title: "title" } },
        },
      });
      const { result } = renderHook(() => useCreateBoard({ notify }));
      await result.current.createBoard(data);
      expect(navigate).toHaveBeenCalledWith("/boards/id");
    });
  });

  describe("on error", () => {
    it("should notify the user with the default error message", async () => {
      sendFn.mockRejectedValue(new Error("error"));
      const { result } = renderHook(() => useCreateBoard({ notify }));
      await result.current.createBoard(data);
      expect(notify).toHaveBeenCalledWith(
        "Failed to create the board. Please try again later."
      );
    });
  });
});
