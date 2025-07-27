import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext.js";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp.js";
import { useQuery } from "@tanstack/react-query";
import { IBestHttpResponse } from "../../../../utils/BestHttp/BestHttpInstance.js";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { GetBoardsResponseDto } from "@kanban/dtos/BoardDtoTypes";
import {
  boardDtoMock,
  boardMock,
} from "../../../../__fixtures__/board/index.js";
import { renderHook } from "@testing-library/react";
import useGetBoards from "./useGetBoards.js";

vi.mock("../../../../hooks/useAuthContext/useAuthContext.js");
vi.mock("../../../../hooks/usePrivateHttp/usePrivateHttp.js");
vi.mock("@tanstack/react-query");

describe("useGetBoards.ts", () => {
  let sendRequestFn: Mock;
  let notify: Mock;

  const sendRequestReponseMock: IBestHttpResponse<
    ServerResponseDto<GetBoardsResponseDto>
  > = {
    success: true,
    status: 200,
    data: {
      errors: [],
      result: {
        boardDtos: [
          {
            ...boardDtoMock,
            last_accessed_at: "2025-07-20 11:27:58.000 +0300",
          },
          {
            ...boardDtoMock,
            last_accessed_at: "2025-07-21 11:27:58.000 +0300",
          },
          {
            ...boardDtoMock,
            last_accessed_at: "2025-07-19 11:27:58.000 +0300",
          },
        ],
      },
    },
    errors: [],
  };

  beforeEach(() => {
    sendRequestFn = vi.fn().mockResolvedValue(sendRequestReponseMock);
    notify = vi.fn();

    (useAuthContext as Mock).mockReturnValue({ user: { id: "user_id" } });

    (usePrivateHttp as Mock).mockReturnValue({ send: sendRequestFn });

    (useQuery as Mock).mockImplementation(({ queryFn }) => {
      return { refetch: queryFn };
    });
  });

  it("should call useQuery with correct arguments", async () => {
    const { result } = renderHook(() => useGetBoards());

    await result.current.getBoards();

    const calls = (useQuery as Mock).mock.calls[0][0];

    expect(calls.queryKey).toEqual(["get_boards_" + "user_id"]);
    expect(calls.queryFn).toBeTypeOf("function");
    expect(calls.enabled).toBe(false);
    expect(calls.retry).toBe(false);
  });

  it("should call send request function with correct arguments", async () => {
    const { result } = renderHook(() => useGetBoards());

    await result.current.getBoards();

    expect(sendRequestFn).toHaveBeenCalledWith("/boards", { method: "get" });
  });

  it("should throw an return an empty array and notify user if query.refetch return null", async () => {
    sendRequestFn.mockResolvedValue({ data: null });

    const { result } = renderHook(() => useGetBoards({ notify }));

    const res = await result.current.getBoards();

    expect(res).toEqual([]);
    expect(notify).toHaveBeenCalledWith("Failed to fetch boards.");
  });

  it("should return all boards sorted by 'lastAccessedAt' param if request was successfull", async () => {
    (useQuery as Mock).mockImplementation(() => {
      return {
        refetch: vi.fn().mockResolvedValue({ data: sendRequestReponseMock }),
      };
    });

    const { result } = renderHook(() => useGetBoards({ notify }));

    const res = await result.current.getBoards();

    expect(notify).not.toHaveBeenCalled();
    expect(res).toEqual([
      {
        ...boardMock,
        lastAccessedAt: "2025-07-21 11:27:58.000 +0300",
      },
      {
        ...boardMock,
        lastAccessedAt: "2025-07-20 11:27:58.000 +0300",
      },
      {
        ...boardMock,
        lastAccessedAt: "2025-07-19 11:27:58.000 +0300",
      },
    ]);
  });
});
