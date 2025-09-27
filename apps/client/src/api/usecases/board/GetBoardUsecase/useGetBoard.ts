import { useQuery } from "@tanstack/react-query";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { BoardDto, GetBoardResponseDto } from "@kanban/dtos/BoardDtoTypes";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import BoardTransformer from "../../../dtoTransformers/boardTransformer/BoardTransformer";
import { AxiosError } from "axios";
import { useState } from "react";

interface Props {
  boardId: string;
}

function useGetBoard({ boardId }: Props) {
  const [error, setError] = useState("");

  const http = usePrivateHttp();

  const getBoardRequest = async (): Promise<BoardDto | null> => {
    setError("");
    try {
      const response = await http.get<ServerResponseDto<GetBoardResponseDto>>(
        "/boards/" + boardId
      );

      if (!response.data.success) return null;

      return response.data.result.boardDto;
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error as AxiosError<ServerResponseDto<null>>;

        const message =
          err.response?.data.errors[0] ?? "Failed to fetch board.";

        setError(message);
      }
      return null;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["get-board-" + boardId],
    queryFn: () => getBoardRequest(),
    retry: true,
    refetchOnWindowFocus: true,
    enabled: true,
  });

  return {
    board: data ? BoardTransformer.dtoToBoard(data) : null,
    isGetBoardLoading: isLoading,
    error,
  };
}

export default useGetBoard;
