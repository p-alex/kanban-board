import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp.js";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext.js";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { BoardDto } from "@kanban/dtos/BoardDtoTypes";

interface Props {
  boardId: string;
}

function useUnmarkBoardAsFavorite({ boardId }: Props) {
  const auth = useAuthContext();
  const http = usePrivateHttp();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["unmark-board-as-favorite-" + boardId + auth.user.id],
    mutationFn: () =>
      http.post<ServerResponseDto<null>, undefined>(
        `/boards/${boardId}/unmark-favorite`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-boards"],
      });

      queryClient.setQueryData(["get-board-" + boardId], {
        ...queryClient.getQueryData<BoardDto>(["get-board-" + boardId]),
        is_favorite: false,
      });
    },
  });

  return {
    unmarkBoardAsFavorite: () => mutateAsync(),
    isUnmarkBoardAsFavoriteLoading: isPending,
  };
}

export default useUnmarkBoardAsFavorite;
