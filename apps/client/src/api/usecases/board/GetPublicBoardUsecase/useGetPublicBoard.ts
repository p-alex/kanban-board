import IBoard from "../../../domain/IBoard.js";
import { useQuery } from "@tanstack/react-query";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import {
  BoardDto,
  GetPublicBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp.js";
import BoardTransformer from "../../../dtoTransformers/boardTransformer/BoardTransformer.js";

interface Props {
  boardId: string;
}

function useGetPublicBoard({ boardId }: Props): {
  board: IBoard | null;
  isGetBoardLoading: boolean;
} {
  if (!boardId) return { board: null, isGetBoardLoading: false };
  const http = usePrivateHttp();

  const getBoardRequest = async (): Promise<BoardDto | null> => {
    try {
      const response = await http.get<
        ServerResponseDto<GetPublicBoardResponseDto>
      >("/boards/" + boardId + "/public");

      if (!response.data.success) return null;

      return response.data.result.boardDto;
    } catch (error) {
      return null;
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["get-board-" + boardId],
    queryFn: () => getBoardRequest(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    board: data ? BoardTransformer.dtoToBoard(data) : null,
    isGetBoardLoading: isLoading,
  };
}

export default useGetPublicBoard;
