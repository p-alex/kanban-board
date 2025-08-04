import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import IBoard from "../../../domain/IBoard";
import {
  UpdateBoardRequestDto,
  UpdateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import boardToDto, { BoardToDto } from "../../../dtoTransformers/boardToDto";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter";
import notificationCenter from "../../../../utils/NotificationCenter";
import { GET_BOARDS_QUERY_KEY } from "../GetBoardsUsecase/useGetBoards";

interface Props {
  notify: NotificationCenter["display"];
  defaultBoardToDto: BoardToDto;
}

export const UPDATE_BOARD_MUTATION_KEY = "update_board";
export const UPDATE_BOARD_ERROR_MESSAGE =
  "Failed to mark board as favorite. Try again later.";

function useUpdateBoard({
  notify = notificationCenter.display,
  defaultBoardToDto = boardToDto,
}: Partial<Props> = {}) {
  const queryClient = useQueryClient();
  const http = usePrivateHttp();

  const mutation = useMutation({
    mutationKey: [UPDATE_BOARD_MUTATION_KEY],
    mutationFn: (board: IBoard) =>
      http.send<
        ServerResponseDto<UpdateBoardResponseDto>,
        UpdateBoardRequestDto
      >("/boards", {
        method: "put",
        body: { toUpdateBoardDto: defaultBoardToDto(board) },
      }),
  });

  const update = async (board: IBoard) => {
    try {
      const result = await mutation.mutateAsync(board);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [GET_BOARDS_QUERY_KEY] });
      }
    } catch (error) {
      console.log(error);
      notify(UPDATE_BOARD_ERROR_MESSAGE);
    }
  };

  return { update, isLoading: mutation.isPending };
}

export type UpdateBoard = ReturnType<typeof useUpdateBoard>;

export default useUpdateBoard;
