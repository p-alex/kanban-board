import CenterLayout from "../components/CenterLayout/CenterLayout";
import MultiStep from "../components/MultiStep/MultiStep";
import RegisterForm from "../components/Forms/RegisterForm";
import EmailVerificationForm from "../components/Forms/EmailVerificationForm";
import Container from "../components/Container/Container";

function RegisterPage() {
  return (
    <CenterLayout>
      <Container>
        <MultiStep
          steps={(stepProps) => [
            {
              name: "Register",
              content: <RegisterForm successCallback={stepProps.nextStep} />,
            },
            {
              name: "Email Verification",
              content: <EmailVerificationForm />,
            },
          ]}
        />
      </Container>
    </CenterLayout>
  );
}

export default RegisterPage;
