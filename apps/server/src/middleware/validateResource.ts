import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { IHttpResponse } from "../interfaces/adapter/ExpressAdapter.js";

function validateResource(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      ...req.params,
      ...req.query,
    };

    const validationResult = schema.safeParse(data);

    if (validationResult.success) {
      req.body = validationResult.data;
      next();
      return;
    }

    const validationErrors = validationResult.error.flatten().fieldErrors;

    let errors: string[] = [];

    for (let key in validationErrors) {
      for (let i = 0; i < validationErrors[key]!.length; i++) {
        errors.push(validationErrors[key]![i]);
      }
    }

    const errorResponse: IHttpResponse<null> = {
      code: 401,
      success: false,
      errors,
      result: null,
    };

    res.status(errorResponse.code);

    res.json(errorResponse);
  };
}

export default validateResource;
