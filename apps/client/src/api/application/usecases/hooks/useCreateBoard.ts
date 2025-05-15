import { useMutation } from "@tanstack/react-query";
import createBoardUsecase from "../createBoardUseCase";
import { CreateNewBoardFormData } from "../../../../components/CreateNewBoardModal/CreateNewBoardValidation";

function useCreateBoard() {
  return useMutation({
    mutationKey: ["create-board"],
    mutationFn: (data: CreateNewBoardFormData) => createBoardUsecase(data),
  });
}

export type CreateBoardReq = ReturnType<typeof useCreateBoard>;

export default useCreateBoard;
