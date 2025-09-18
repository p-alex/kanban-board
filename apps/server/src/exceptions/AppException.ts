class AppException {
  code: number;
  errors: string[];
  location: string;

  constructor(code: number, errors: string[], location: string) {
    this.code = code;
    this.errors = errors;
    this.location = location;
  }
}

export default AppException;
