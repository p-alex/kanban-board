import { ZodSchema } from "zod";
import {
  IHttpRequest,
  IMiddlewareResponse,
} from "../../interfaces/adapter/index.js";

class ResourceValidator {
  validate = (schema: ZodSchema) => {
    return (httpReq: IHttpRequest): Promise<IMiddlewareResponse> => {
      const data = {
        ...httpReq.body,
        ...httpReq.params,
        ...httpReq.query,
      };

      const validationResult = schema.safeParse(data);

      if (validationResult.success) {
        httpReq.body = validationResult.data;
        return Promise.resolve({
          success: true,
          errorCode: 0,
          headers: {},
          errors: [],
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
        success: false,
        errorCode: 400,
        headers: {},
        errors: errors,
      });
    };
  };
}

export default ResourceValidator;
