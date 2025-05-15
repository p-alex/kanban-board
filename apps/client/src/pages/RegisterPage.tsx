import CenterLayout from "../components/CenterLayout/CenterLayout";
import RegisterForm from "../components/RegisterForm";
import useRegisterUser from "../hooks/api/user/useRegisterUser";
import notificationCenter from "../utils/NotificationCenter";

function RegisterPage() {
  const register = useRegisterUser();

  return (
    <CenterLayout>
      <RegisterForm
        displayNotification={notificationCenter.display}
        submitFunc={register.mutateAsync}
      />
    </CenterLayout>
  );
}

export default RegisterPage;
