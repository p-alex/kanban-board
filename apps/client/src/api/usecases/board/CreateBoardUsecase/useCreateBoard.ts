import { useMutation } from "@tanstack/react-query";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext";
import NotificationCenter from "../../../../utils/NotificationCenter/NotificationCenter";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import {
  CreateBoardRequestDto,
  CreateBoardResponseDto,
} from "@kanban/dtos/BoardDtoTypes";
import BestHttpResponseException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import notificationCenter from "../../../../utils/NotificationCenter";
import { useNavigate } from "react-router-dom";
import generateSlug, { GenerateSlug } from "../../../../utils/generateSlug";

interface UseCreateBoard {
  notify: NotificationCenter["display"];
  toSlug: GenerateSlug;
}

function useCreateBoard({
  notify = notificationCenter.display,
  toSlug = generateSlug,
}: Partial<UseCreateBoard> = {}) {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const http = usePrivateHttp();

  const mutation = useMutation({
    mutationKey: ["create-board-" + auth.user.id],
    mutationFn: (boardData: CreateBoardRequestDto) =>
      http.send<
        ServerResponseDto<CreateBoardResponseDto>,
        CreateBoardRequestDto
      >("/boards", { method: "post", body: boardData }),
  });

  const createBoard = async (boardData: CreateBoardRequestDto) => {
    try {
      const result = await mutation.mutateAsync(boardData);

      if (result.success && result.data) {
        notify("Board created!");

        navigate(
          "/boards/" +
            result.data.result.boardDto.id +
            "/" +
            toSlug(result.data.result.boardDto.title)
        );
      }
    } catch (error) {
      if (error instanceof BestHttpResponseException) {
        notify(
          (
            error as BestHttpResponseException<
              ServerResponseDto<CreateBoardResponseDto>
            >
          ).data.errors[0]
        );
        return;
      }
      notify("Failed to create the board. Please try again later.");
    }
  };

  return createBoard;
}

export default useCreateBoard;
