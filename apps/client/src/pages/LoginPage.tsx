import CenterLayout from "../components/CenterLayout/CenterLayout";
import Container from "../components/Container/Container";
import LoginForm from "../components/Forms/LoginForm";
import useLogin from "../hooks/api/auth/useLogin";
import notificationCenter from "../utils/NotificationCenter";

function LoginPage() {
  const login = useLogin();

  return (
    <CenterLayout>
      <Container>
        <LoginForm
          displayNotification={notificationCenter.display}
          submitFunc={login.mutateAsync}
        />
      </Container>
    </CenterLayout>
  );
}

export default LoginPage;
