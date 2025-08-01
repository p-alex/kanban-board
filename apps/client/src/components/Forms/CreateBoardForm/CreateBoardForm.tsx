import { useForm } from "react-hook-form";
import boardDtos from "@kanban/dtos/BoardDtos";
import boardDtoTypes from "@kanban/dtos/BoardDtoTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import TextFieldGroup from "../../TextFieldGroup";
import useAuthContext from "../../../hooks/useAuthContext/useAuthContext";
import PrimaryButton from "../../PrimaryButton";
import useCreateBoard from "../../../api/usecases/board/CreateBoardUsecase/useCreateBoard";
import { ModalContentProps } from "../../Modal/Modal";
import Form from "../../Form/Form";
import Container from "../../Container/Container";
import SelectField from "../../SelectField/SelectField";

interface Props {
  modalProps: ModalContentProps;
}

function CreateBoardForm(props: Props) {
  const auth = useAuthContext();
  const createBoard = useCreateBoard();

  const defaultValues: boardDtoTypes.CreateBoardRequestDto = {
    user_id: auth.user.id,
    title: "",
    status: "private",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues,
    resolver: zodResolver(boardDtos.createBoardRequestDto),
  });

  const selectFieldValues: boardDtoTypes.CreateBoardRequestDto["status"][] = [
    "private",
    "public",
  ];

  return (
    <Container>
      <Form title="Create board" onSubmit={handleSubmit(createBoard)}>
        <TextFieldGroup
          label="title"
          className={props.modalProps.firstFocusableElementClass}
          input={<input {...register("title")} />}
          error={errors.title?.message}
        />
        <SelectField
          label="status"
          values={selectFieldValues}
          onChange={(value) => setValue("status", value)}
        />
        <PrimaryButton
          type="submit"
          className={props.modalProps.lastFocusableElementClass}
          disabled={isSubmitting}
        >
          Create board
        </PrimaryButton>
      </Form>
    </Container>
  );
}

export default CreateBoardForm;
