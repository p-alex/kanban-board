import { useQuery } from "@tanstack/react-query";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { GetBoardsResponseDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../../../domain/IBoard";
import dtoToBoard, { DtoToBoard } from "../../../dtoTransformers/dtoToBoard";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter";
import notificationCenter from "../../../../utils/NotificationCenter";
import { DateUtil } from "@kanban/utils";
import { useState } from "react";

interface Props {
  notify: NotificationCenter["display"];
  date: DateUtil;
  toBoard: DtoToBoard;
}

export const GET_BOARDS_QUERY_KEY = "get_boards";

function useGetBoards({
  notify = notificationCenter.display,
  toBoard = dtoToBoard,
}: Partial<Props> = {}) {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [favoriteBoards, setFavoriteBoards] = useState<IBoard[]>([]);

  const http = usePrivateHttp();

  const getBoards = async (): Promise<IBoard[]> => {
    let allBoards: IBoard[] = [];

    try {
      const result = await http.send<
        ServerResponseDto<GetBoardsResponseDto>,
        undefined
      >("/boards", {
        method: "get",
      });

      if (result.success && result.data) {
        const boards = result.data.result.boardDtos.map((boardDto) =>
          toBoard(boardDto)
        );

        setBoards(boards);

        const favoriteBoards = boards.filter(
          (board) => board.isFavorite !== false
        );

        setFavoriteBoards(favoriteBoards);

        allBoards = [...boards];
      }

      return allBoards;
    } catch (error) {
      console.log(error);
      notify("Failed to fetch boards.");
      return allBoards;
    }
  };

  const { isLoading, isRefetching } = useQuery({
    queryKey: [GET_BOARDS_QUERY_KEY],
    queryFn: () => getBoards(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    boards,
    favoriteBoards,
    initialIsLoading: isLoading && !isRefetching,
  };
}

export default useGetBoards;
