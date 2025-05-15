import BigLogoContainer from "../BigLogo/BigLogoContainer";
import TextFieldGroup from "../TextFieldGroup";
import PrimaryButton from "../PrimaryButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerFormSchema } from "./RegisterFormValidation";
import { useForm } from "react-hook-form";
import Form from "../Form/Form";
import Container from "../Container/Container";
import { Link } from "react-router-dom";
import NotificationCenter from "../../utils/NotificationCenter/NotificationCenter";
import { RegisterUserUsecase } from "../../api/application/usecases/user/registerUserUsecase";

interface Props {
  displayNotification: NotificationCenter["display"];
  submitFunc: RegisterUserUsecase;
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
      const result = await props.submitFunc(data);
      if (result.success) {
        props.displayNotification("Account created!");
        reset();
      }
    } catch (error) {
      props.displayNotification("Failed to create account. Try again later.");
    }
  };

  return (
    <Container>
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
    </Container>
  );
}

export default RegisterForm;
