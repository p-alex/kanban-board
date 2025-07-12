import { ZodSchema } from "zod";
import {
  IHandlerResponse,
  IHttpRequest,
} from "../../interfaces/adapter/index.js";
import HttpResponseFactory from "../../HttpResponseFactory/HttpResponseFactory.js";

class ResourceValidator {
  constructor(private readonly _httpResponseFactory: HttpResponseFactory) {}
  validate = (schema: ZodSchema) => {
    return (httpReq: IHttpRequest): Promise<IHandlerResponse<null>> => {
      const data = {
        ...httpReq.body,
        ...httpReq.params,
        ...httpReq.query,
      };

      const validationResult = schema.safeParse(data);

      if (validationResult.success) {
        httpReq.body = validationResult.data;
        return Promise.resolve({
          response: this._httpResponseFactory.success(200, null),
        });
      }

      const validationErrors = validationResult.error.flatten().fieldErrors;

      let errors: string[] = [];

      for (let key in validationErrors) {
        for (let i = 0; i < validationErrors[key]!.length; i++) {
          errors.push(validationErrors[key]![i]);
        }
      }

      return Promise.resolve({
        response: this._httpResponseFactory.error(400, errors),
      });
    };
  };
}

export default ResourceValidator;
