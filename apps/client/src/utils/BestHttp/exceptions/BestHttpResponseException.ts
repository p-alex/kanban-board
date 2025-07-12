class BestHttpResponseException<TData> {
  code: number;
  errors: string[];
  data: TData;

  constructor(code: number, errors: string[], data: TData) {
    this.code = code;
    this.errors = errors;
    this.data = data;
  }
}

export default BestHttpResponseException;
