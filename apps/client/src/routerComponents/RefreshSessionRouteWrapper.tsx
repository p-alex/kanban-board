import useAuthContext from "../hooks/useAuthContext/useAuthContext";
import { useEffect, useRef } from "react";
import useRefreshSession from "../api/usecases/auth/RefreshSessionUsecase/useRefreshSession";
import Spinner from "../components/Spinner/Spinner";

interface Props {
  children: React.ReactNode;
}

function RefreshSessionRouteWrapper(props: Props) {
  const auth = useAuthContext();

  const refreshSession = useRefreshSession();

  const ran = useRef<boolean>(false);

  useEffect(() => {
    if (ran.current === false) refreshSession();
    ran.current = true;
  }, []);

  return auth.isLoading ? (
    <div
      className="w-full h-screen flex items-center justify-center"
      data-testId="spinner_container"
    >
      <Spinner size={45} />
    </div>
  ) : (
    props.children
  );
}

export default RefreshSessionRouteWrapper;
