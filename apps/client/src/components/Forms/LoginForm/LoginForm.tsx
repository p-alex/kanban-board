import { useForm } from "react-hook-form";
import Form from "../../Form/Form.js";
import PrimaryButton from "../../PrimaryButton/index.js";
import TextFieldGroup from "../../TextFieldGroup/index.js";
import { LoginFormData, loginFormSchema } from "./LoginForm.schema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import useLogin from "../../../api/usecases/auth/LoginUsecase/useLogin.js";
import BigLogo from "../../BigLogo/BigLogo.js";
import { http } from "../../../utils/BestHttp/index.js";
import useAuthContext from "../../../hooks/useAuthContext/useAuthContext.js";
import notificationCenter from "../../../utils/NotificationCenter/index.js";

function LoginForm() {
  const auth = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginFormSchema),
  });

  const login = useLogin({ httpClient: http });

  const submit = async (credentials: LoginFormData) => {
    const { success, data, error } = await login(credentials);

    if (success && data) {
      auth.handleSetAuth(data.user, data.accessToken);
      reset();
      return;
    }

    notificationCenter.display(error);
  };

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <div className="w-full text-center flex items-center flex-col gap-6 mb-6">
        <BigLogo />
      </div>
      <div className="flex flex-col gap-4">
        <TextFieldGroup
          label="Email"
          input={
            <input type="text" {...register("email")} autoComplete="email" />
          }
          error={errors?.email && errors.email.message}
        />
        <TextFieldGroup
          label="Password"
          input={
            <input
              type="password"
              {...register("password")}
              autoComplete="current-password"
            />
          }
          error={errors?.password && errors.password.message}
        />
        <div className="flex justify-end">
          <p className="text-(--text_lt) dark:text-(--text_dt) text-sm">
            Don't have an account?{" "}
            <Link to={"/register"} className="text-(--primary_color)">
              Register
            </Link>
          </p>
        </div>
        <PrimaryButton type="submit" disabled={isSubmitting}>
          Login
        </PrimaryButton>
      </div>
    </Form>
  );
}

export default LoginForm;
