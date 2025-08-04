import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Mock } from "vitest";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext.js";
import notificationCenter from "../../../../utils/NotificationCenter/index.js";
import loginUsecase from "./index.js";
import useLogin from "./useLogin.js";
import LoginUsecase from "./LoginUsecase.js";

vi.mock("../../../../hooks/useAuthContext/useAuthContext.js");
vi.mock("../../../../utils/NotificationCenter/index.js");
vi.mock(".", async () => ({
  default: {
    execute: vi.fn(),
  },
}));

describe("useLogin", () => {
  const mockHandleSetAuth = vi.fn();
  const mockNotify = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthContext as Mock).mockReturnValue({
      handleSetAuth: mockHandleSetAuth,
    });

    (notificationCenter.display as Mock).mockImplementation(mockNotify);
  });

  const userData = { email: "test@example.com", password: "password123" };

  it("should call handleSetAuth when login is successful", async () => {
    const authData = {
      user: { id: 1, name: "Test User" },
      accessToken: "token123",
    };

    (loginUsecase.execute as Mock).mockResolvedValue({ authData });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      const response = await result.current(userData);
      expect(response).toEqual({ success: true });
    });

    expect(loginUsecase.execute).toHaveBeenCalledWith(userData);
    expect(mockHandleSetAuth).toHaveBeenCalledWith(
      authData.user,
      authData.accessToken
    );
  });

  it("should notify error message from result.error when login fails", async () => {
    const errorMessage = "Invalid credentials";

    (loginUsecase.execute as Mock).mockResolvedValue({ error: errorMessage });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      const response = await result.current(userData);
      expect(response).toEqual({ success: false });
    });

    expect(mockNotify).toHaveBeenCalledWith(errorMessage);
  });

  it("should notify fallback error message when result.error is undefined", async () => {
    (loginUsecase.execute as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      const response = await result.current(userData);
      expect(response).toEqual({ success: false });
    });

    expect(mockNotify).toHaveBeenCalledWith("Login failed. Try again later.");
  });

  it("should use custom login and notify functions if provided", async () => {
    const customLogin = {
      execute: vi.fn().mockResolvedValue({
        authData: {
          user: { id: 2, name: "Custom User" },
          accessToken: "customToken",
        },
      }),
    } as unknown as LoginUsecase;
    const customNotify = vi.fn();

    const { result } = renderHook(() =>
      useLogin({ login: customLogin, notify: customNotify })
    );

    await act(async () => {
      const response = await result.current(userData);
      expect(response).toEqual({ success: true });
    });

    expect(customLogin.execute).toHaveBeenCalledWith(userData);
  });
});
