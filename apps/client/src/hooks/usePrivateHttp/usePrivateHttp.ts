import { useEffect } from "react";
import useAuthContext from "../useAuthContext/useAuthContext";
import useRefreshSession from "../../api/usecases/auth/RefreshSessionUsecase/useRefreshSession";
import BestHttpInstance from "../../utils/BestHttp/BestHttpInstance";
import { privateHttp } from "../../utils/BestHttp";

interface UsePrivateHttpProps {
  http: BestHttpInstance;
}

function usePrivateHttp({
  http = privateHttp,
}: Partial<UsePrivateHttpProps> = {}) {
  const auth = useAuthContext();

  const refreshSession = useRefreshSession();

  const applyInterceptors = () => {
    const requestInterceptor = http.addRequestInterceptor(
      "accessToken interceptor",
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = "Bearer " + auth.accessToken;
        }
        config.withCredentials = true;
        return config;
      }
    );

    const responseInterceptor = http.addResponseInterceptor(
      "retry if access token expired interceptor",
      (result) => {
        return result;
      },
      async (result, config) => {
        if (result.status === 401 && config?.wasSent === undefined) {
          config.wasSent = true;
          const result = await refreshSession();
          if (!result?.accessToken) return Promise.reject("error");
          config.headers.Authorization = "Bearer " + result.accessToken;
          return http.send<any, any>(config.url, config);
        }
        return Promise.reject(result.errors[0]);
      }
    );

    return { requestInterceptor, responseInterceptor };
  };

  useEffect(() => {
    const { requestInterceptor, responseInterceptor } = applyInterceptors();
    return () => {
      requestInterceptor.eject();
      responseInterceptor.eject();
    };
  }, [auth, applyInterceptors]);

  return http;
}

export default usePrivateHttp;
