import { useMutation, useQueryClient } from "@tanstack/react-query";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp";
import IBoard from "../../../domain/IBoard";
import { UpdateBoardResponseDto } from "@kanban/dtos/BoardDtoTypes";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import BoardTransformer from "../../../dtoTransformers/boardTransformer/BoardTransformer";
import extractApiErrorMessage from "../../../extractApiErrorMessage";
import { IUsecaseResponse } from "../..";
import boardCacheUpdater from "../BoardCacheUpdater";

interface Props {
  boardId: string;
}

function useUpdateBoard({ boardId }: Props) {
  const queryClient = useQueryClient();
  const http = usePrivateHttp();

  const updateBoard = async (
    board: IBoard
  ): Promise<IUsecaseResponse<{ updatedBoard: IBoard } | null>> => {
    try {
      const { data } = await http.put<
        ServerResponseDto<UpdateBoardResponseDto>
      >("/boards", { toUpdateBoardDto: BoardTransformer.boardToDto(board) });

      if (data.success && data.result) {
        const updatedBoard = BoardTransformer.dtoToBoard(
          data.result.updatedBoardDto
        );

        boardCacheUpdater.updateGetBoardCache(
          queryClient,
          data.result.updatedBoardDto
        );
        boardCacheUpdater.updateOneInGetBoardsCache(
          queryClient,
          data.result.updatedBoardDto
        );

        return { success: true, error: "", data: { updatedBoard } };
      }

      return {
        success: false,
        error: data?.errors[0] ?? "Failed to update board",
        data: null,
      };
    } catch (error) {
      const errorMessage = extractApiErrorMessage({
        error,
        defaultErrorMessage: "Failed to update board",
      });

      return { success: false, error: errorMessage, data: null };
    }
  };

  const mutation = useMutation({
    mutationKey: ["update-board-" + boardId],
    mutationFn: (board: IBoard) => updateBoard(board),
  });

  return { updateBoard, isUpdateBoardLoading: mutation.isPending };
}

export type UpdateBoard = ReturnType<typeof useUpdateBoard>;

export default useUpdateBoard;
