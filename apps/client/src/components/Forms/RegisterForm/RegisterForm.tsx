import BigLogoContainer from "../../BigLogo/BigLogoContainer.js";
import TextFieldGroup from "../../TextFieldGroup/index.js";
import PrimaryButton from "../../PrimaryButton/index.js";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterFormData,
  registerFormSchema,
} from "./RegisterFormValidation.js";
import { useForm } from "react-hook-form";
import Form from "../../Form/Form.js";
import { Link } from "react-router-dom";
import NotificationCenter from "../../../utils/NotificationCenter/NotificationCenter.js";
import { RegisterUser } from "../../../hooks/api/user/useRegisterUser.js";
import HttpError from "../../../utils/HttpClient/HttpError.js";

interface Props {
  displayNotification: NotificationCenter["display"];
  submitFunc: RegisterUser;
  callback: () => void;
}

function RegisterForm(props: Props) {
  const { register, handleSubmit, formState, reset } =
    useForm<RegisterFormData>({
      defaultValues: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      resolver: zodResolver(registerFormSchema),
    });

  const submit = async (data: RegisterFormData) => {
    try {
      const result = await props.submitFunc({ data, accessToken: "" });
      if (result.success) {
        props.displayNotification("Account created!");
        reset();
        props.callback();
      }
    } catch (error) {
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
      <div className="flex flex-col gap-4">
        <TextFieldGroup
          label="Username"
          input={<input type="text" {...register("username")} />}
          error={
            formState.errors?.username && formState.errors.username.message
          }
        />
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
        <TextFieldGroup
          label="Confirm Password"
          input={<input type="password" {...register("confirmPassword")} />}
          error={
            formState.errors?.confirmPassword &&
            formState.errors.confirmPassword.message
          }
        />
        <div className="flex justify-end">
          <p className="text-(--textLightTheme) dark:text-(--textDarkTheme) text-sm">
            Already have an account?{" "}
            <Link to={"/login"} className="text-(--primaryColor)">
              Login
            </Link>
          </p>
        </div>
        <PrimaryButton type="submit">Register</PrimaryButton>
      </div>
    </Form>
  );
}

export default RegisterForm;
