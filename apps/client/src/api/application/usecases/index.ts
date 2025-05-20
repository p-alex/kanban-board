import axios from "axios";

export interface Response<TResult = any> {
  code: number;
  success: boolean;
  errors: string[];
  result: TResult;
}

export const privateAxios = (accessToken: string) =>
  axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL,
    headers: { Authorization: "Bearer " + accessToken },
    withCredentials: true,
  });
