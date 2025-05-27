import BigLogoContainer from "../../BigLogo/BigLogoContainer";
import TextFieldGroup from "../../TextFieldGroup";
import PrimaryButton from "../../PrimaryButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailVerificationFormData,
  emailVerificationFormSchema,
} from "./EmailVerificationFormValidation";
import NotificationCenter from "../../../utils/NotificationCenter/NotificationCenter";
import { VerifyEmailUsecase } from "../../../api/application/usecases/verificationCode/verifyEmailUsecase";
import Form from "../../Form/Form";
import { HttpError } from "../../../utils/HttpClient";

interface Props {
  displayNotification: NotificationCenter["display"];
  submitFunc: VerifyEmailUsecase;
  callback: () => void;
}

function EmailVerificationForm(props: Props) {
  const { register, formState, reset, handleSubmit } = useForm({
    defaultValues: { verificationCode: "" },
    resolver: zodResolver(emailVerificationFormSchema),
  });

  const submit = async (data: EmailVerificationFormData) => {
    try {
      const result = await props.submitFunc(data);
      if (result.success) {
        props.displayNotification("Account verified! You can now login.");
        reset();
        props.callback();
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError) {
        props.displayNotification(error.message);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <div className="w-full text-center flex items-center flex-col gap-6 mb-6">
        <BigLogoContainer />
      </div>
      <p className="text-(--textLightTheme) dark:text-(--textDarkTheme)">
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
