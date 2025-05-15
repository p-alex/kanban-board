import { useFieldArray, useForm } from "react-hook-form";
import { AddNewBoardModalProps } from "./CreateNewBoardModal.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewBoardFormSchema } from "./CreateNewBoardValidation.js";
import { CryptoUtil } from "@kanban/utils";
import { useEffect } from "react";

export interface AddNewBoardFormData {
  boardTitle: string;
  boardColumns: { id: string; title: string }[];
}

function useCreateNewBoardModal(props: AddNewBoardModalProps) {
  const { register, control, handleSubmit, getValues, formState } =
    useForm<AddNewBoardFormData>({
      defaultValues: {
        boardTitle: "",
        boardColumns: [],
      },
      resolver: zodResolver(createNewBoardFormSchema),
      mode: "onSubmit",
    });

  const { append, remove } = useFieldArray({
    name: "boardColumns",
    control,
  });

  const addColumn = () =>
    append({ id: new CryptoUtil().randomUUID(), title: "" });

  const submit = handleSubmit(async (data: AddNewBoardFormData) => {
    try {
      const result = await props.submitRequest.mutateAsync({ ...data });
      if (result.success) {
        props.visibilityProps.toggleVisibility();
        props.displayNotification("Board created!");
      }
    } catch (error) {
      props.displayNotification("Failed to create the board, try again later.");
    }
  });

  useEffect(() => {
    props.visibilityProps.setCanToggleOff(!formState.isSubmitting);
  }, [formState.isSubmitting]);

  return {
    form: {
      register,
      getValues,
      formState,
    },
    addColumn,
    removeColumn: remove,
    submit,
  };
}

export default useCreateNewBoardModal;
