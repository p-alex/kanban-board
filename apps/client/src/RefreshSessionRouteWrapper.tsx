import useAuthContext from "./hooks/useAuthContext/useAuthContext";
import Spinner from "./components/Spinner/Spinner";
import { useEffect, useRef } from "react";
import useRefreshSession from "./api/usecases/auth/RefreshSessionUsecase/useRefreshSession";

interface Props {
  children: React.ReactNode;
}

function RefreshSessionRouteWrapper(props: Props) {
  const auth = useAuthContext();

  const refreshSession = useRefreshSession();

  const ran = useRef<boolean>(false);

  useEffect(() => {
    if (ran.current === true) return;
    refreshSession();
    ran.current = true;
  }, []);

  return auth.isLoading ? (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner size={45} />
    </div>
  ) : (
    props.children
  );
}

export default RefreshSessionRouteWrapper;
