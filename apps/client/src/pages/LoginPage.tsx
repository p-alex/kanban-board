import CenterLayout from "../components/CenterLayout/CenterLayout";
import Container from "../components/Container/Container";
import LoginForm from "../components/Forms/LoginForm";

function LoginPage() {
  return (
    <CenterLayout>
      <Container>
        <LoginForm />
      </Container>
    </CenterLayout>
  );
}

export default LoginPage;
