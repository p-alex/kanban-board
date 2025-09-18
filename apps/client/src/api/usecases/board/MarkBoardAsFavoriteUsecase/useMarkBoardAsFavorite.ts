import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { BoardDto } from "@kanban/dtos/BoardDtoTypes";

interface Props {
  boardId: string;
}

function useMarkBoardAsFavorite({ boardId }: Props) {
  const auth = useAuthContext();
  const http = usePrivateHttp();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["mark-board-as-favorite-" + boardId + auth.user.id],
    mutationFn: () =>
      http.post<ServerResponseDto<null>, undefined>(
        `/boards/${boardId}/mark-favorite`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-boards"],
      });
      queryClient.setQueryData(["get-board-" + boardId], {
        ...queryClient.getQueryData<BoardDto>(["get-board-" + boardId]),
        is_favorite: true,
      });
    },
  });

  return {
    markBoardAsFavorite: () => mutateAsync(),
    isMarkBoardAsFavoriteLoading: isPending,
  };
}

export default useMarkBoardAsFavorite;
