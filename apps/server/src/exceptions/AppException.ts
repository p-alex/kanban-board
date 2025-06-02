class AppException {
  code: number;
  errors: string[];

  constructor(code: number, errors: string[]) {
    this.code = code;
    this.errors = errors;
  }
}

export default AppException;
