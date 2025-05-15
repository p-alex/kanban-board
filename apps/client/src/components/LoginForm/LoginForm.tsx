import { useForm } from "react-hook-form";
import BigLogoContainer from "../BigLogo/BigLogoContainer";
import Form from "../Form/Form";
import PrimaryButton from "../PrimaryButton";
import TextFieldGroup from "../TextFieldGroup";
import { LoginFormData, loginFormSchema } from "./LoginFormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { LoginUsecase } from "../../api/application/usecases/auth/loginUsecase";
import NotificationCenter from "../../utils/NotificationCenter/NotificationCenter";

interface Props {
  displayNotification: NotificationCenter["display"];
  submitFunc: LoginUsecase;
}

function LoginForm(props: Props) {
  const { register, handleSubmit, formState, reset } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginFormSchema),
  });

  const submit = async (data: LoginFormData) => {
    try {
      const result = await props.submitFunc(data);
      if (result.success) {
        props.displayNotification(result.message.text);
        reset();
      }
    } catch (error) {
      props.displayNotification("Failed to log in. Try again later.");
    }
  };

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <div className="w-full text-center flex items-center flex-col gap-6 mb-6">
        <BigLogoContainer />
      </div>
      <div className="flex flex-col gap-4">
        <TextFieldGroup
          label="Email"
          input={<input type="text" {...register("email")} />}
          error={formState.errors?.email && formState.errors.email.message}
        />
        <TextFieldGroup
          label="Password"
          input={<input type="password" {...register("password")} />}
          error={
            formState.errors?.password && formState.errors.password.message
          }
        />
        <div className="flex justify-end">
          <p className="text-(--textLightTheme) dark:text-(--textDarkTheme) text-sm">
            Don't have an account?{" "}
            <Link to={"/register"} className="text-(--primaryColor)">
              Register
            </Link>
          </p>
        </div>
        <PrimaryButton type="submit" disabled={formState.isSubmitting}>
          Login
        </PrimaryButton>
      </div>
    </Form>
  );
}

export default LoginForm;
