import { useForm } from "react-hook-form";
import BigLogoContainer from "../../BigLogo/BigLogoContainer.js";
import Form from "../../Form/Form.js";
import PrimaryButton from "../../PrimaryButton/index.js";
import TextFieldGroup from "../../TextFieldGroup/index.js";
import { LoginFormData, loginFormSchema } from "./LoginFormValidation.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import NotificationCenter from "../../../utils/NotificationCenter/NotificationCenter.js";

interface Props {
  displayNotification: NotificationCenter["display"];
  submitFunc: () => {};
}

function LoginForm(_: Props) {
  const { register, handleSubmit, formState } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginFormSchema),
  });

  return (
    <Form onSubmit={handleSubmit(() => {})}>
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
