import { useMutation, useQueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp.js";
import IBoard from "../../../domain/IBoard.js";
import { renderHook } from "@testing-library/react";
import useUpdateBoard, {
  UPDATE_BOARD_ERROR_MESSAGE,
  UPDATE_BOARD_MUTATION_KEY,
} from "./useUpdateBoard.js";
import {
  boardDtoMock,
  boardMock,
} from "../../../../__fixtures__/board/index.js";
import { GET_BOARDS_QUERY_KEY } from "../GetBoardsUsecase/useGetBoards.js";

vi.mock("@tanstack/react-query");
vi.mock("../../../../hooks/usePrivateHttp/usePrivateHttp.js");

describe("useUpdateBoard.ts", () => {
  let notify: Mock;
  let invalidateQueries: Mock;
  let sendFn: Mock;
  let boardToDto: Mock;

  beforeEach(() => {
    notify = vi.fn();
    invalidateQueries = vi.fn();
    sendFn = vi.fn();
    boardToDto = vi.fn().mockReturnValue(boardDtoMock);

    (useQueryClient as Mock).mockReturnValue({
      invalidateQueries,
    });

    (usePrivateHttp as Mock).mockReturnValue({
      send: sendFn,
    });

    (useMutation as Mock).mockImplementation(({ mutationFn }) => {
      return {
        mutateAsync: vi.fn().mockImplementation((board: IBoard) => {
          return mutationFn(board);
        }),
        isPending: false,
      };
    });
  });

  it("should should call useMutation with correct arguments", () => {
    renderHook(() => useUpdateBoard());

    const calledOptions = (useMutation as Mock).mock.calls[0][0];

    expect(calledOptions.mutationKey).toEqual([UPDATE_BOARD_MUTATION_KEY]);
    expect(calledOptions.mutationFn).toBeInstanceOf(Function);
  });

  it("should call sendFn with correct args", async () => {
    const { result } = renderHook(() =>
      useUpdateBoard({ notify, defaultBoardToDto: boardToDto })
    );

    await result.current.update(boardMock);

    expect(sendFn).toHaveBeenCalledWith("/boards", {
      method: "put",
      body: { toUpdateBoardDto: boardDtoMock },
    });
  });

  it("should invalidate get boards query on successfull request", async () => {
    sendFn.mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useUpdateBoard({ notify, defaultBoardToDto: boardToDto })
    );

    await result.current.update(boardMock);

    expect(sendFn).toHaveBeenCalled();
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: [GET_BOARDS_QUERY_KEY],
    });
  });

  it("should not invalidate get boards query if request fails", async () => {
    sendFn.mockResolvedValue({ success: false });

    const { result } = renderHook(() =>
      useUpdateBoard({ notify, defaultBoardToDto: boardToDto })
    );

    await result.current.update(boardMock);

    expect(sendFn).toHaveBeenCalled();
    expect(invalidateQueries).not.toHaveBeenCalled();
  });

  it("should notify the user if request fails", async () => {
    sendFn.mockRejectedValue(new Error());

    const { result } = renderHook(() =>
      useUpdateBoard({ notify, defaultBoardToDto: boardToDto })
    );

    await result.current.update(boardMock);

    expect(notify).toHaveBeenCalledWith(UPDATE_BOARD_ERROR_MESSAGE);
  });

  it("should return the correct object", () => {
    const { result } = renderHook(() =>
      useUpdateBoard({ notify, defaultBoardToDto: boardToDto })
    );

    expect(result.current.update).toBeInstanceOf(Function);
    expect(typeof result.current.isLoading).toBe("boolean");
  });
});
