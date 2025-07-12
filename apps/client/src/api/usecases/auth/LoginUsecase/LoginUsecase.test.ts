import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginResponseDto } from "@kanban/dtos/AuthDtoTypes";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import { IUser } from "../../../domain/IUser.js";
import LoginUsecase from "./LoginUsecase.js";
import { IBestHttpResponse } from "../../../../utils/BestHttp/BestHttpInstance.js";
import BestHttpResponseException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException.js";

const mockSendRequest = vi.fn();
const mockDtoToUser = vi.fn();

const userData = { email: "user@example.com", password: "password123" };
const fakeUser: IUser = {
  id: "1",
  username: "username",
};

let loginUsecase: LoginUsecase;

beforeEach(() => {
  vi.clearAllMocks();
  loginUsecase = new LoginUsecase(mockSendRequest, mockDtoToUser);
});

describe("LoginUsecase", () => {
  it("returns authData on successful login", async () => {
    const mockResponse: IBestHttpResponse<ServerResponseDto<LoginResponseDto>> =
      {
        errors: [],
        status: 200,
        success: true,
        data: {
          errors: [],
          result: {
            userDto: { id: "1", username: "user" },
            accessToken: "abc123",
          },
        },
      };

    mockSendRequest.mockResolvedValueOnce(mockResponse);
    mockDtoToUser.mockReturnValueOnce(fakeUser);

    const result = await loginUsecase.execute(userData);

    expect(result).toEqual({
      authData: {
        user: fakeUser,
        accessToken: "abc123",
      },
      error: "",
    });

    expect(mockSendRequest).toHaveBeenCalledWith("/auth/login", {
      body: userData,
      method: "post",
      withCredentials: true,
    });

    expect(mockDtoToUser).toHaveBeenCalledWith(
      mockResponse.data.result.userDto
    );
  });

  it("returns error when login fails with server error", async () => {
    const mockResponse: IBestHttpResponse<ServerResponseDto<null>> = {
      success: false,
      status: 400,
      data: {
        errors: ["Invalid credentials"],
        result: null,
      },
      errors: ["Invalid credentials"],
    };

    mockSendRequest.mockResolvedValueOnce(mockResponse);

    const result = await loginUsecase.execute(userData);

    expect(result).toEqual({
      authData: null,
      error: "Invalid credentials",
    });
  });

  it("handles BestHttpResponseException with error message", async () => {
    const mockError = new BestHttpResponseException(400, ["errors"], {
      errors: ["error"],
    });

    mockSendRequest.mockRejectedValueOnce(mockError);

    const result = await loginUsecase.execute(userData);

    expect(result).toEqual({
      authData: null,
      error: "error",
    });
  });

  it("handles unknown exception", async () => {
    mockSendRequest.mockRejectedValueOnce(new Error("Something unexpected"));

    const result = await loginUsecase.execute(userData);

    expect(result).toEqual({
      authData: null,
      error: "Something went wrong. Please try again later.",
    });
  });
});
