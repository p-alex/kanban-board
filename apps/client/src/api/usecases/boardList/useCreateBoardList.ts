import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import usePrivateHttp from "../../../hooks/usePrivateHttp/usePrivateHttp";
import {
  CreateBoardListRequestDto,
  CreateBoardListResponseDto,
} from "@kanban/dtos/BoardListDtoTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import IBoardList from "../../domain/IBoardList";
import BoardListTransformer from "../../dtoTransformers/boardListTransformer/BoardListTransformer";

interface Props {
  boardId: string;
}

function useCreateBoardList({ boardId }: Props) {
  const http = usePrivateHttp();
  const [createBoardListError, setCreateBoardListError] = useState("");
  const queryClient = useQueryClient();

  const createBoardListRequest = async (
    boardListData: CreateBoardListRequestDto
  ): Promise<IBoardList | null> => {
    setCreateBoardListError("");
    try {
      const response = await http.post<
        any,
        AxiosResponse<ServerResponseDto<CreateBoardListResponseDto>>,
        CreateBoardListRequestDto
      >("/board-lists", boardListData);

      if (!response.data?.success) return null;

      const oldBoardListsCache = queryClient.getQueryData<IBoardList[]>([
        "get-board-lists-" + boardId,
      ]);

      if (oldBoardListsCache) {
        queryClient.setQueryData(
          ["get-board-lists-" + boardId],
          [
            ...oldBoardListsCache,
            BoardListTransformer.toBoardList(response.data.result.boardListDto),
          ]
        );
      }

      return BoardListTransformer.toBoardList(
        response.data.result.boardListDto
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error as AxiosError<ServerResponseDto<null>>;

        const message =
          err.response?.data.errors[0] ?? "Failed to fetch board.";

        setCreateBoardListError(message);

        return null;
      }

      setCreateBoardListError("Failed to fetch board.");
      return null;
    }
  };

  const mutation = useMutation({
    mutationKey: ["create-board-list"],
    mutationFn: (boardListData: CreateBoardListRequestDto) =>
      createBoardListRequest(boardListData),
  });

  return {
    createBoardList: (boardListData: CreateBoardListRequestDto) =>
      mutation.mutateAsync(boardListData),
    isCreateBoardLoading: mutation.isPending,
    createBoardListError,
  };
}

export default useCreateBoardList;
