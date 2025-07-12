import TextFieldGroup from "../../TextFieldGroup/index.js";
import PrimaryButton from "../../PrimaryButton/index.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerFormSchema } from "./RegisterForm.schema.js";
import { useForm } from "react-hook-form";
import Form from "../../Form/Form.js";
import { Link } from "react-router-dom";
import BigLogo from "../../BigLogo/BigLogo.js";
import useRegisterUser from "../../../api/usecases/user/RegisterUserUsecase/useRegisterUser.js";

interface Props {
  successCallback: Function;
}

function RegisterForm(props: Props) {
  const { registerUser } = useRegisterUser();

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
    const { success } = await registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
    });
    if (success) {
      reset();
      props.successCallback();
    }
  };

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <div className="w-full text-center flex items-center flex-col gap-6 mb-6">
        <BigLogo />
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
          <p className="text-(--text_lt) dark:text-(--text_dt) text-sm">
            Already have an account?{" "}
            <Link to={"/login"} className="text-(--primary_color)">
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
