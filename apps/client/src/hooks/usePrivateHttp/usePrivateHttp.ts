import { useEffect, useRef } from "react";
import useAuthContext from "../useAuthContext/useAuthContext";
import useRefreshSession from "../../api/usecases/auth/RefreshSessionUsecase/useRefreshSession";
import { privateHttp } from "../../api";
import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

interface UsePrivateHttpProps {
  http: AxiosInstance;
}

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  wasSent: boolean;
}

function usePrivateHttp({
  http = privateHttp,
}: Partial<UsePrivateHttpProps> = {}) {
  const auth = useAuthContext();

  const refreshSession = useRefreshSession();

  const tokenRef = useRef(auth.accessToken);
  useEffect(() => {
    tokenRef.current = auth.accessToken;
  }, [auth.accessToken]);

  useEffect(() => {
    const requestInterceptor = privateHttp.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = "Bearer " + auth.accessToken;
        }
        return config;
      },
      null
    );

    const responseInterceptor = privateHttp.interceptors.response.use(
      (result) => result,
      async (error: AxiosError) => {
        const prevRequest = error?.config as CustomInternalAxiosRequestConfig;
        if (error.response?.status === 401 && !prevRequest?.wasSent) {
          prevRequest.wasSent = true;
          const { data, isSuccess } = await refreshSession();
          if (!isSuccess) Promise.reject(error);
          prevRequest!.headers[
            "Authorization"
          ] = `Bearer ${data?.data?.newAccessToken}`;
          return privateHttp(prevRequest!);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      privateHttp.interceptors.request.eject(requestInterceptor);
      privateHttp.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return http;
}

export default usePrivateHttp;
