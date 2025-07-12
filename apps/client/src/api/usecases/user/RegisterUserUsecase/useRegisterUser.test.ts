import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import useRegisterUser from "./useRegisterUser.js";
import RegisterUsecase from "./RegisterUserUsecase.js";
import { CreateUserRequestDto } from "@kanban/dtos/UserDtoTypes";

describe("useRegisterUser.ts", () => {
  let notifyMock: Mock;
  let registerUsecaseMock: Mocked<RegisterUsecase>;

  const userData: CreateUserRequestDto = {
    username: "username",
    email: "email",
    password: "password",
  };

  beforeEach(() => {
    notifyMock = vi.fn();
    registerUsecaseMock = {
      execute: vi.fn(),
    } as unknown as Mocked<RegisterUsecase>;
  });

  it("should handle successfull user registration correctly", async () => {
    registerUsecaseMock.execute.mockResolvedValue({
      success: true,
      errors: [],
    });

    const { result } = renderHook(() =>
      useRegisterUser({
        notify: notifyMock,
        registerUsecase: registerUsecaseMock,
      })
    );

    await result.current.registerUser(userData);

    expect(notifyMock).toHaveBeenCalled();

    expect(registerUsecaseMock.execute).toHaveBeenCalledWith(userData);
  });

  it("should handle failed user registration correctly", async () => {
    registerUsecaseMock.execute.mockResolvedValue({
      success: false,
      errors: ["error"],
    });

    const { result } = renderHook(() =>
      useRegisterUser({
        notify: notifyMock,
        registerUsecase: registerUsecaseMock,
      })
    );

    await result.current.registerUser(userData);

    expect(notifyMock).toHaveBeenCalledWith("error");

    expect(registerUsecaseMock.execute).toHaveBeenCalledWith(userData);
  });
});
