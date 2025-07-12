import { describe, it, expect, vi, beforeEach } from "vitest";
import RefreshSessionUsecase from "./RefreshSessionUsecase.js";
import BestHttpException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException.js";

describe("RefreshSessionUsecase", () => {
  const mockSendRequest = vi.fn();
  const mockDtoToUser = vi.fn();

  let refreshSessionUsecase: RefreshSessionUsecase;

  beforeEach(() => {
    vi.clearAllMocks();
    refreshSessionUsecase = new RefreshSessionUsecase(
      mockSendRequest,
      mockDtoToUser
    );
  });

  it("should return authData when refresh is successful", async () => {
    const userDto = { id: 1, name: "Test User" };
    const transformedUser = { id: 1, name: "Test User", role: "admin" };

    mockSendRequest.mockResolvedValue({
      status: 200,
      success: true,
      data: {
        result: {
          userDto,
          newAccessToken: "token123",
        },
      },
    });

    mockDtoToUser.mockReturnValue(transformedUser);

    const result = await refreshSessionUsecase.execute();

    expect(mockSendRequest).toHaveBeenCalledWith("/auth/refresh", {
      method: "get",
      withCredentials: true,
    });
    expect(mockDtoToUser).toHaveBeenCalledWith(userDto);

    expect(result).toEqual({
      status: 200,
      authData: {
        user: transformedUser,
        accessToken: "token123",
      },
    });
  });

  it("should return authData null when success is false", async () => {
    mockSendRequest.mockResolvedValue({
      status: 401,
      success: false,
      data: null,
    });

    const result = await refreshSessionUsecase.execute();

    expect(result).toEqual({
      status: 401,
      authData: null,
    });
  });

  it("should return authData null when data is missing", async () => {
    mockSendRequest.mockResolvedValue({
      status: 500,
      success: true,
      data: null,
    });

    const result = await refreshSessionUsecase.execute();

    expect(result).toEqual({
      status: 500,
      authData: null,
    });
  });

  it("should handle BestHttpException and return status from error code", async () => {
    const error = new BestHttpException(401, ["Unauthorized"], null);
    mockSendRequest.mockRejectedValue(error);

    const result = await refreshSessionUsecase.execute();

    expect(result).toEqual({
      status: 401,
      authData: null,
    });
  });

  it("should handle unknown errors and return status 0", async () => {
    const unknownError = new Error("Network Error");
    mockSendRequest.mockRejectedValue(unknownError);

    const result = await refreshSessionUsecase.execute();

    expect(result).toEqual({
      status: 0,
      authData: null,
    });
  });
});
