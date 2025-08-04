import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp.js";
import { renderHook, waitFor } from "@testing-library/react";
import useGetBoards from "./useGetBoards.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IBestHttpResponse } from "../../../../utils/BestHttp/BestHttpInstance.js";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { BoardDto, GetBoardsResponseDto } from "@kanban/dtos/BoardDtoTypes";
import {
  boardDtoMock,
  boardMock,
} from "../../../../__fixtures__/board/index.js";
import IBoard from "../../../domain/IBoard.js";

vi.mock("../../../../hooks/usePrivateHttp/usePrivateHttp.js");

const client = new QueryClient();

function Wrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useGetBoards.ts", () => {
  let sendFn: Mock;
  let sendFnResponse: IBestHttpResponse<
    ServerResponseDto<GetBoardsResponseDto>
  >;
  let notify: Mock;

  const boardDtos: BoardDto[] = [
    { ...boardDtoMock, id: "1", is_favorite: true },
    { ...boardDtoMock, id: "2", is_favorite: false },
    { ...boardDtoMock, id: "3", is_favorite: false },
    { ...boardDtoMock, id: "4", is_favorite: true },
  ];

  const boards: IBoard[] = [
    { ...boardMock, id: "1", isFavorite: true },
    { ...boardMock, id: "2", isFavorite: false },
    { ...boardMock, id: "3", isFavorite: false },
    { ...boardMock, id: "4", isFavorite: true },
  ];

  beforeEach(() => {
    sendFn = vi.fn();
    notify = vi.fn();

    sendFnResponse = {
      success: true,
      status: 200,
      data: { errors: [], result: { boardDtos } },
      errors: [],
    };

    (usePrivateHttp as Mock).mockReturnValue({ send: sendFn });
  });

  it("should call send request fn with correct arguments", () => {
    renderHook(() => useGetBoards(), { wrapper: Wrapper });

    expect(sendFn).toHaveBeenCalledWith("/boards", { method: "get" });
  });

  it("returns all boards after successful fetch", async () => {
    sendFn.mockResolvedValue(sendFnResponse);

    const { result } = renderHook(() => useGetBoards(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.boards).toEqual(boards);
    });
  });

  it("returns favorite boards after successful fetch", async () => {
    sendFn.mockResolvedValue(sendFnResponse);

    const { result } = renderHook(() => useGetBoards(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.favoriteBoards).toHaveLength(2);
      expect(result.current.favoriteBoards[0].id).toBe("1");
      expect(result.current.favoriteBoards[1].id).toBe("4");
    });
  });

  it("should notify user if request fails", async () => {
    sendFn.mockRejectedValue(new Error());

    renderHook(() => useGetBoards({ notify }), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(notify).toHaveBeenCalledWith("Failed to fetch boards.");
    });
  });

  it("should return isLoading and isFetching booleans", () => {
    sendFn.mockRejectedValue(new Error());

    const { result } = renderHook(() => useGetBoards({ notify }), {
      wrapper: Wrapper,
    });

    expect(result.current.initialIsLoading).toBeTypeOf("boolean");
  });
});
