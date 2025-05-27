import CenterLayout from "../components/CenterLayout/CenterLayout";
import MultiStep from "../components/MultiStep/MultiStep";
import RegisterForm from "../components/Forms/RegisterForm";
import useRegisterUser from "../hooks/api/user/useRegisterUser";
import notificationCenter from "../utils/NotificationCenter";
import EmailVerificationForm from "../components/Forms/EmailVerificationForm";
import useVerificationCode from "../hooks/api/verificationCode/useVerificationCode";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container/Container";

function RegisterPage() {
  const register = useRegisterUser();
  const verifyEmail = useVerificationCode();
  const navigate = useNavigate();

  return (
    <CenterLayout>
      <Container>
        <MultiStep
          steps={(stepProps) => [
            {
              name: "Register",
              content: (
                <RegisterForm
                  displayNotification={notificationCenter.display}
                  submitFunc={register.mutateAsync}
                  callback={stepProps.nextStep}
                />
              ),
            },
            {
              name: "Email Verification",
              content: (
                <EmailVerificationForm
                  displayNotification={notificationCenter.display}
                  submitFunc={verifyEmail.mutateAsync}
                  callback={() => navigate("/login")}
                />
              ),
            },
          ]}
        />
      </Container>
    </CenterLayout>
  );
}

export default RegisterPage;
