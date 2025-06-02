import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import VerifyUserController from "./VerifyUserController.js";
import VerifiyUserService from "../../../../application/services/user/VerifiyUserService/VerifiyUserService.js";
import {
  IHttpRequest,
  IHttpResponse,
} from "../../../adapter/ExpressAdapter/ExpressAdapter.js";
import { VerifyUserRequestDto } from "@kanban/dtos/UserDtoTypes";

describe("VerifyUserController.ts", () => {
  let verifyUserServiceMock: Mocked<VerifiyUserService>;
  let verifyUserController: VerifyUserController;

  const verificationCode = "some-verification-code";

  const mockHttpReq: IHttpRequest<VerifyUserRequestDto> = {
    body: {
      verification_code: verificationCode,
    },
    params: {},
    query: {},
  };

  const mockHttpRes: IHttpResponse<null> = {
    code: 200,
    success: true,
    errors: [],
    result: null,
  };

  beforeEach(() => {
    verifyUserServiceMock = {
      execute: vi.fn().mockResolvedValue(undefined),
    } as unknown as Mocked<VerifiyUserService>;

    verifyUserController = new VerifyUserController(verifyUserServiceMock);
  });

  it("should verify user using verification code", async () => {
    const result = await verifyUserController.handle(mockHttpReq);

    expect(verifyUserServiceMock.execute).toHaveBeenCalledWith(
      verificationCode
    );
    expect(result).toEqual(mockHttpRes);
  });
});
