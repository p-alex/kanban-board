export interface IUsecaseResponse<TData> {
  error: string;
  success: boolean;
  data: TData;
}

export class UsecaseResponseFactory {
  static success = <TData>(data: TData): IUsecaseResponse<TData> => {
    return { success: true, error: "", data };
  };

  static error = (error: string): IUsecaseResponse<null> => {
    return { success: false, error, data: null };
  };
}
