import BestHttpException from "../exceptions/BestHttpException";

class BodyHandler {
  constructor() {}

  handle = <TBody>(contentType: string, body: TBody) => {
    switch (contentType) {
      case "application/json":
        return JSON.stringify(body);

      default:
        throw new BestHttpException("Unsupported content type");
    }
  };
}

export default BodyHandler;
