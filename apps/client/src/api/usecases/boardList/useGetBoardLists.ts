import { useQuery } from "@tanstack/react-query";
import usePrivateHttp from "../../../hooks/usePrivateHttp/usePrivateHttp";
import { AxiosError, AxiosResponse } from "axios";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { GetBoardListsResponseDto } from "@kanban/dtos/BoardListDtoTypes";
import IBoardList from "../../domain/IBoardList";
import BoardListTransformer from "../../dtoTransformers/boardListTransformer/BoardListTransformer";
import { useState } from "react";

interface Props {
  boardId: string;
}

function useGetBoardLists({ boardId }: Props) {
  const [getBoardListsError, setGetBoardListsError] = useState("");
  const http = usePrivateHttp();

  const getBoardLists = async (): Promise<IBoardList[]> => {
    try {
      const response = await http.get<
        any,
        AxiosResponse<ServerResponseDto<GetBoardListsResponseDto>>
      >("/board-lists/" + boardId);

      if (!response.data?.success) return [];

      return response.data.result.boardListDtos.map((boardListDto) =>
        BoardListTransformer.toBoardList(boardListDto)
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error as AxiosError<ServerResponseDto<null>>;
        setGetBoardListsError(err.response!.data.errors[0]);
        return [];
      }
      setGetBoardListsError(
        "Failed to fetch board lists. Please try again later."
      );
      return [];
    }
  };

  const { data: boardLists, isLoading } = useQuery({
    queryKey: ["get-board-lists-" + boardId],
    queryFn: getBoardLists,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    boardLists: boardLists ? boardLists : [],
    isGetBoardListsLoading: isLoading,
    getBoardListsError,
  };
}

export default useGetBoardLists;
