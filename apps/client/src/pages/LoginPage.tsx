import useLogin from "../api/usecases/auth/LoginUsecase/useLogin";
import CenterLayout from "../components/CenterLayout/CenterLayout";
import Container from "../components/Container/Container";
import LoginForm from "../components/Forms/LoginForm";

function LoginPage() {
  const login = useLogin();

  return (
    <CenterLayout>
      <Container>
        <LoginForm submitFunc={login} />
      </Container>
    </CenterLayout>
  );
}

export default LoginPage;
