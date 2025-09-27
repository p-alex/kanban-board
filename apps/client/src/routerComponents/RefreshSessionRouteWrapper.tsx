import { useEffect, useRef } from "react";
import useRefreshSession from "../api/usecases/auth/RefreshSessionUsecase/useRefreshSession";
import Spinner from "../components/Spinner/Spinner";
import CenterLayout from "../components/CenterLayout/CenterLayout";

interface Props {
  children: React.ReactNode;
}

function RefreshSessionRouteWrapper(props: Props) {
  const refreshSession = useRefreshSession();

  const isInitial = useRef<boolean>(false);

  useEffect(() => {
    if (isInitial.current === true) return;
    refreshSession();
    isInitial.current = true;
  }, []);

  return isInitial.current === false ? (
    <CenterLayout>
      <Spinner size={24} />
    </CenterLayout>
  ) : (
    props.children
  );
}

export default RefreshSessionRouteWrapper;
