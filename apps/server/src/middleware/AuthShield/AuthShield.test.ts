import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import AppException from "../../exceptions/AppException.js";
import AuthShield from "./AuthShield.js";
import { JwtUtil } from "@kanban/utils";
import HttpResponseFactory from "../../HttpResponseFactory/HttpResponseFactory.js";
import {
  httpRequestFactory,
  IHandlerResponse,
  IHttpRequest,
} from "../../interfaces/adapter/index.js";
import { IAuthenticatedUser } from "./index.js";

describe("AuthShield.ts", () => {
  let mockHttpReq: IHttpRequest;
  let jwtUtil: JwtUtil;
  let httpResponseFactory: HttpResponseFactory;
  let authShield: AuthShield;

  const accessTokenJwtSecret = "jwt-secret";

  const authenticatedUser: IAuthenticatedUser = {
    id: "user-id",
  };

  beforeEach(() => {
    mockHttpReq = httpRequestFactory();
    mockHttpReq.accessToken = "valid.jwt.token";

    jwtUtil = {
      verify: vi.fn().mockResolvedValue(authenticatedUser),
    } as unknown as JwtUtil;

    const mockHttpResponse = {
      code: 200,
      errors: [],
      result: null,
      success: true,
    };

    httpResponseFactory = {
      success: vi.fn().mockReturnValue(mockHttpResponse),
    } as unknown as HttpResponseFactory;

    authShield = new AuthShield(
      jwtUtil,
      accessTokenJwtSecret,
      httpResponseFactory
    );
  });

  it("should call jwt.verify with correct arguments", async () => {
    await authShield.protect(mockHttpReq);

    expect(jwtUtil.verify).toHaveBeenCalledWith(
      mockHttpReq.accessToken,
      accessTokenJwtSecret
    );
  });

  it("should return the correct response with authenticatedUser", async () => {
    const result = await authShield.protect(mockHttpReq);

    const expectedResponse: IHandlerResponse<null> = {
      response: {
        code: 200,
        errors: [],
        result: null,
        success: true,
      },
      authenticatedUser,
    };

    expect(result).toEqual(expectedResponse);
  });

  it("should throw AppException if no accessToken is provided", async () => {
    mockHttpReq.accessToken = "";

    try {
      await authShield.protect(mockHttpReq);
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      if (error instanceof AppException) {
        expect(error.code).toBe(401);
        expect(error.errors).toEqual(["Invalid or expired access token"]);
      }
    }
  });

  it("should throw AppException if jwt.verify throws an error", async () => {
    (jwtUtil.verify as unknown as Mock).mockRejectedValue(
      new Error("Invalid token")
    );

    try {
      await authShield.protect(mockHttpReq);
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      if (error instanceof AppException) {
        expect(error.code).toBe(401);
        expect(error.errors).toEqual(["Invalid or expired access token"]);
      }
    }
  });
});
