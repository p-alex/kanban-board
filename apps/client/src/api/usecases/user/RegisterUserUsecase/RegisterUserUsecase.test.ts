import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import RegisterUserUsecase from "./RegisterUserUsecase.js";
import { CreateUserRequestDto } from "@kanban/dtos/UserDtoTypes";
import BestHttpException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException.js";

describe("RegisterUserUsecase.ts", () => {
  let sendRequestMock: Mock;
  let registerUserUsecase: RegisterUserUsecase;

  const userData: CreateUserRequestDto = {
    email: "email",
    password: "password",
    username: "username",
  };

  beforeEach(() => {
    sendRequestMock = vi.fn();
    registerUserUsecase = new RegisterUserUsecase(sendRequestMock);
  });

  it("should call _sendRequest with correct corretly", async () => {
    await registerUserUsecase.execute(userData);

    expect(sendRequestMock).toHaveBeenCalledWith("/users", {
      method: "post",
      body: userData,
    });
  });

  it("should return correct data on successfull user register request", async () => {
    sendRequestMock.mockResolvedValue({
      success: true,
      errors: [],
    });

    const result = await registerUserUsecase.execute(userData);

    expect(result).toEqual({ success: result.success, errors: [] });
  });

  it("should return correct data on failed user register request", async () => {
    sendRequestMock.mockResolvedValue({
      success: false,
      errors: ["error"],
    });

    const result = await registerUserUsecase.execute(userData);

    expect(result).toEqual({ success: result.success, errors: ["error"] });
  });

  it("should handle BestHttpException correctly", async () => {
    sendRequestMock.mockRejectedValue(
      new BestHttpException(400, ["error"], { errors: ["error"] })
    );

    const result = await registerUserUsecase.execute(userData);

    expect(result).toEqual({
      success: false,
      errors: ["error"],
    });
  });

  it("should handle any error correctly", async () => {
    sendRequestMock.mockRejectedValue(new Error("error"));

    const result = await registerUserUsecase.execute(userData);

    expect(result).toEqual({
      success: false,
      errors: ["Registration failed. Please try again later."],
    });
  });
});
