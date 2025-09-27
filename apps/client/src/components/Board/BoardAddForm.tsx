import { useForm } from "react-hook-form";
import TextFieldGroup from "../TextFieldGroup/index.js";
import PrimaryButton from "../PrimaryButton/index.js";
import Button from "../Button/Button.js";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AutoResizeTextarea from "../AutoResizeTextarea/AutoResizeTextarea.js";

interface Props {
  requestFunc: (value: string) => Promise<void>;
  closeFn: Function;
  actionBtnText: string;
}

function BoardAddForm({ requestFunc, actionBtnText, closeFn }: Props) {
  const { register, handleSubmit, formState } = useForm<{
    value: string;
  }>({
    defaultValues: {
      value: "",
    },
    resolver: zodResolver(
      z.object({
        value: z.string().min(1, "Can't be blank").max(24),
      })
    ),
  });

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit((data) => requestFunc(data.value))}
    >
      <TextFieldGroup
        input={<AutoResizeTextarea {...register("value")} autoFocus />}
        error={formState.errors?.value?.message as string | undefined}
      />
      <div className="flex items-center gap-2">
        <PrimaryButton type="submit">{actionBtnText}</PrimaryButton>
        <Button type="button" onClick={() => closeFn()}>
          Close
        </Button>
      </div>
    </form>
  );
}

export default BoardAddForm;
