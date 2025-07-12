import { beforeEach, describe, expect, it, vi } from "vitest";
import VerifiyUserService from "../../../../application/services/user/VerifiyUserService/VerifiyUserService.js";
import HttpResponseFactory from "../../../../HttpResponseFactory/HttpResponseFactory.js";
import VerifyUserController from "./VerifyUserController.js";
import {
  httpRequestFactory,
  IHandlerResponse,
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/index.js";
import { VerifyUserRequestDto } from "@kanban/dtos/UserDtoTypes";

describe("VerifyUserController.ts", () => {
  let mockHttpReq: IHttpRequest<VerifyUserRequestDto>;
  let verifyUserService: VerifiyUserService;
  let httpResponseFactory: HttpResponseFactory;
  let verifyUserController: VerifyUserController;

  beforeEach(() => {
    mockHttpReq = httpRequestFactory();
    mockHttpReq.body = {
      verification_code: "123456",
    };

    verifyUserService = {
      execute: vi.fn().mockResolvedValue(undefined),
    } as unknown as VerifiyUserService;

    const mockHttpResponse: IHttpResponse<null> = {
      code: 200,
      errors: [],
      result: null,
      success: true,
    };

    httpResponseFactory = {
      success: vi.fn().mockReturnValue(mockHttpResponse),
    } as unknown as HttpResponseFactory;

    verifyUserController = new VerifyUserController(
      verifyUserService,
      httpResponseFactory
    );
  });

  it("should call verifyUserService with correct arguments", async () => {
    await verifyUserController.handle(mockHttpReq);

    expect(verifyUserService.execute).toHaveBeenCalledWith(
      mockHttpReq.body.verification_code
    );
  });

  it("should return the correct response", async () => {
    const result = await verifyUserController.handle(mockHttpReq);

    const handlerResponse: IHandlerResponse<null> = {
      response: {
        code: 200,
        errors: [],
        result: null,
        success: true,
      },
    };

    expect(result).toEqual(handlerResponse);
  });
});
