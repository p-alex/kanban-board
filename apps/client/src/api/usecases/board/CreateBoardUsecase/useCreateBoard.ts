import { useMutation } from "@tanstack/react-query";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import {
  CreateBoardRequestDto,
  CreateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import notificationCenter from "../../../../utils/NotificationCenter";
import { useNavigate } from "react-router-dom";
import extractApiErrorMessage from "../../../extractApiErrorMessage";

interface UseCreateBoard {
  notify: NotificationCenter["display"];
}

function useCreateBoard({
  notify = notificationCenter.display,
}: Partial<UseCreateBoard> = {}) {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const http = usePrivateHttp();

  const mutation = useMutation({
    mutationKey: ["create-board-" + auth.user.id],
    mutationFn: (boardData: CreateBoardRequestDto) => createBoard(boardData),
  });

  const createBoard = async (boardData: CreateBoardRequestDto) => {
    try {
      const { data } = await http.post<
        ServerResponseDto<CreateBoardResponseDto>
      >("/boards", boardData);

      if (data.success && data.result) {
        notify("Board created!");
        navigate("/boards/" + data.result.boardDto.id);
      }
    } catch (error) {
      const errorMessage = extractApiErrorMessage({
        error,
        defaultErrorMessage:
          "Failed to create the board. Please try again later.",
      });
      notify(errorMessage);
    }
  };

  return {
    createBoard: (boardData: CreateBoardRequestDto) =>
      mutation.mutateAsync(boardData),
    isCreateBoardLoding: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
}

export default useCreateBoard;
