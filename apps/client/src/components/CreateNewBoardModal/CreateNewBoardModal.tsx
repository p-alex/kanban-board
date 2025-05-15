import TextFieldGroup from "../TextFieldGroup/TextFieldGroup.js";
import Modal from "../Modal/Modal.js";
import PrimaryButton from "../PrimaryButton/index.js";
import Button from "../Button/Button.js";
import ItemList from "../ItemList/ItemList.js";
import Item from "../ItemList/Item.js";
import useCreateNewBoardModal from "./useCreateNewBoardModal.js";
import { IVisibilityContentProps } from "../VisibilityProvider/VisibilityProvider.js";
import NotificationCenter from "../../utils/NotificationCenter/NotificationCenter.js";
import { CreateBoardReq } from "../../hooks/api/board/useCreateBoard.js";

export interface AddNewBoardModalProps {
  displayNotification: NotificationCenter["display"];
  visibilityProps: IVisibilityContentProps;
  submitRequest: CreateBoardReq;
}

function CreateNewBoardModal(props: AddNewBoardModalProps) {
  const { form, addColumn, removeColumn, submit } =
    useCreateNewBoardModal(props);

  return (
    <Modal
      title={"Create New Board"}
      toggleOff={props.visibilityProps.toggleVisibility}
      content={({ firstFocusableElementClass, lastFocusableElementClass }) => (
        <form className="flex flex-col gap-6" onSubmit={submit}>
          <TextFieldGroup
            label="title"
            input={
              <input
                type="text"
                className={`w-full ${firstFocusableElementClass}`}
                autoFocus
                placeholder="e.g. Web Design"
                {...form.register("boardTitle")}
              />
            }
            error={
              form.formState.errors.boardTitle &&
              form.formState.errors.boardTitle.message
            }
          />
          <ItemList
            title="Columns"
            addBtn={
              <Button type="button" onClick={addColumn}>
                + Add New Column
              </Button>
            }
          >
            {form.getValues("boardColumns").map((item, index) => {
              return (
                <Item
                  key={item.id}
                  index={index}
                  textField={
                    <TextFieldGroup
                      input={
                        <input
                          type="text"
                          className={`w-full ${firstFocusableElementClass}`}
                          autoFocus
                          placeholder={`Name for column #${index + 1}`}
                          {...form.register(`boardColumns.${index}.title`)}
                        />
                      }
                      error={
                        form.formState.errors.boardColumns &&
                        form.formState.errors.boardColumns[index]?.title
                          ?.message
                      }
                    />
                  }
                  removeFunc={removeColumn}
                />
              );
            })}
          </ItemList>
          <PrimaryButton
            type="submit"
            className={`${lastFocusableElementClass}`}
            disabled={form.formState.isSubmitting}
          >
            Create New Board
          </PrimaryButton>
        </form>
      )}
    ></Modal>
  );
}

export default CreateNewBoardModal;
