import TextFieldGroup from "../../TextFieldGroup";
import PrimaryButton from "../../PrimaryButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountVerificationFormData,
  accountVerificationFormData,
} from "./EmailVerificationForm.schema";
import Form from "../../Form/Form";
import BigLogo from "../../BigLogo/BigLogo";
import useVerifyUser from "../../../api/usecases/user/VerifyUserUsecase/useVerifyUser";

function EmailVerificationForm() {
  const verifyUser = useVerifyUser();

  const { register, formState, handleSubmit } = useForm({
    defaultValues: { verificationCode: "" },
    resolver: zodResolver(accountVerificationFormData),
  });

  const submit = async (data: AccountVerificationFormData) => {
    await verifyUser(data.verificationCode);
  };

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <div className="w-full text-center flex items-center flex-col gap-6 mb-6">
        <BigLogo />
      </div>
      <p className="text-(--text_lt) dark:text-(--text_dt)">
        An email containing an account verification code has been sent. The code
        is valid for 15 minutes. Please check your inbox.
      </p>
      <div className="flex flex-col gap-4">
        <TextFieldGroup
          label="Verification code"
          input={<input type="text" {...register("verificationCode")} />}
          error={
            formState.errors?.verificationCode &&
            formState.errors.verificationCode.message
          }
        />
        <PrimaryButton type="submit" disabled={formState.isSubmitting}>
          Verify Account
        </PrimaryButton>
      </div>
    </Form>
  );
}

export default EmailVerificationForm;
