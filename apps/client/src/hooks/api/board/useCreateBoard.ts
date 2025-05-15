import { useMutation } from "@tanstack/react-query";
import { CreateNewBoardFormData } from "../../../components/CreateNewBoardModal/CreateNewBoardValidation";
import createBoardUsecase from "../../../api/application/usecases/board/createBoardUsecase";

function useCreateBoard() {
  return useMutation({
    mutationKey: ["create-board"],
    mutationFn: (data: CreateNewBoardFormData) => createBoardUsecase(data),
  });
}

export type CreateBoardReq = ReturnType<typeof useCreateBoard>;

export default useCreateBoard;
