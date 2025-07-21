import CreateBoardForm from "../../Forms/CreateBoardForm/CreateBoardForm";
import Modal from "../../Modal/Modal";
import { IVisibilityContentProps } from "../../VisibilityProvider/VisibilityProvider";

interface Props {
  visibilityContentProps: IVisibilityContentProps;
}

function CreateBoardModal(props: Props) {
  return (
    <Modal
      content={(modalProps) => <CreateBoardForm modalProps={modalProps} />}
      toggleOff={props.visibilityContentProps.toggleVisibility}
    />
  );
}

export default CreateBoardModal;
