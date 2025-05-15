import { useMutation } from "@tanstack/react-query";
import createBoardUsecase, {
  CreateBoardUsecaseArgs,
} from "../../../api/application/usecases/board/createBoardUsecase";

function useCreateBoard() {
  return useMutation({
    mutationKey: ["create-board"],
    mutationFn: (args: CreateBoardUsecaseArgs) => createBoardUsecase(args),
  });
}

export default useCreateBoard;
