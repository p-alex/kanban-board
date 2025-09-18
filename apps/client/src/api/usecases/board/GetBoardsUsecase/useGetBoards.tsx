import { useQuery } from "@tanstack/react-query";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { GetBoardsResponseDto } from "@kanban/dtos/BoardDtoTypes";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter.js";
import notificationCenter from "../../../../utils/NotificationCenter/index.js";
import { DateUtil } from "@kanban/utils";
import BestHttpResponseException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException.js";
import BoardTransformer from "../../../dtoTransformers/boardTransformer/BoardTransformer.js";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp.js";

interface Props {
  notify: NotificationCenter["display"];
  date: DateUtil;
}

function useGetBoards({
  notify = notificationCenter.display,
}: Partial<Props> = {}) {
  const http = usePrivateHttp();

  const request = async () => {
    try {
      const { data } = await http.get<ServerResponseDto<GetBoardsResponseDto>>(
        "/boards"
      );

      if (data.success && data?.result?.boardDtos) {
        const boards = data.result.boardDtos.map((boardDto) =>
          BoardTransformer.dtoToBoard(boardDto)
        );

        return boards;
      }

      return [];
    } catch (error) {
      let message = "Failed to fetch boards. Please try again later.";
      if (
        error instanceof BestHttpResponseException &&
        error.data?.errors?.length
      ) {
        message = error.data.errors[0];
      }
      notify(message);
      return [];
    }
  };

  const {
    data: boards = [],
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["get-boards"],
    queryFn: () => request(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const favoriteBoards = boards.filter((board) => board.isFavorite === true);

  return {
    boards,
    favoriteBoards,
    isGetBoardsLoading: isLoading,
    isGetBoardsRefeching: isRefetching,
  };
}

export default useGetBoards;
