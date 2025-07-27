import { useQuery } from "@tanstack/react-query";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { GetBoardsResponseDto } from "@kanban/dtos/BoardDtoTypes";
import IBoard from "../../../domain/IBoard";
import dtoToBoard, { DtoToBoard } from "../../../dtoTransformers/dtoToBoard";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter";
import notificationCenter from "../../../../utils/NotificationCenter";
import { DateUtil } from "@kanban/utils";

interface Props {
  notify: NotificationCenter["display"];
  date: DateUtil;
  toBoard: DtoToBoard;
}

function useGetBoards({
  notify = notificationCenter.display,
  date = new DateUtil(),
  toBoard = dtoToBoard,
}: Partial<Props> = {}) {
  const auth = useAuthContext();
  const http = usePrivateHttp();

  const query = useQuery({
    queryKey: ["get_boards_" + auth.user.id],
    queryFn: async () =>
      http.send<ServerResponseDto<GetBoardsResponseDto>, undefined>("/boards", {
        method: "get",
      }),
    enabled: false,
    retry: false,
  });

  const sortBoards = (boards: IBoard[]) => {
    return boards.sort(
      (a, b) =>
        date.dateStringToMs(b.lastAccessedAt) -
        date.dateStringToMs(a.lastAccessedAt)
    );
  };

  const getBoards = async (): Promise<IBoard[]> => {
    try {
      const { data } = await query.refetch();

      if (!data) throw new Error();

      if (data.success && data.data) {
        const boards = data.data.result.boardDtos.map((boardDto) =>
          toBoard(boardDto)
        );

        return sortBoards(boards);
      }

      return [];
    } catch (error) {
      notify("Failed to fetch boards.");
      return [];
    }
  };

  return { getBoards, isLoading: query.isLoading };
}

export default useGetBoards;
