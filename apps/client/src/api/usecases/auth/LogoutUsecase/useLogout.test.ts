import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext.js";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp.js";
import notificationCenter from "../../../../utils/NotificationCenter/index.js";
import { Mock } from "vitest";
import logoutUsecase from "./index.js";
import useLogout from "./useLogout.js";

vi.mock("../../../../hooks/useAuthContext/useAuthContext.js");
vi.mock("../../../../hooks/usePrivateHttp/usePrivateHttp.js");
vi.mock("../../../../utils/NotificationCenter/index.js");
vi.mock(".", async () => ({
  default: {
    execute: vi.fn(),
  },
}));

const ERROR_MESSAGE = "Logout failed. Please try again later.";

describe("useLogout", () => {
  const mockHandleResetAuth = vi.fn();
  const mockNotify = vi.fn();
  const mockSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthContext as Mock).mockReturnValue({
      handleResetAuth: mockHandleResetAuth,
    });
    (usePrivateHttp as Mock).mockReturnValue({
      send: mockSend,
    });
    (notificationCenter.display as Mock).mockImplementation(mockNotify);
  });

  it("should call handleResetAuth and notify success on successful logout", async () => {
    (logoutUsecase.execute as Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(logoutUsecase.execute).toHaveBeenCalledWith(mockSend);
    expect(mockHandleResetAuth).toHaveBeenCalled();
    expect(mockNotify).toHaveBeenCalledWith("Logged out successfully!");
  });

  it("should notify error message if logoutReq returns success: false", async () => {
    (logoutUsecase.execute as Mock).mockResolvedValue({ success: false });

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(mockHandleResetAuth).not.toHaveBeenCalled();
    expect(mockNotify).toHaveBeenCalledWith(ERROR_MESSAGE);
  });

  it("should notify error message if logoutReq throws an error", async () => {
    (logoutUsecase.execute as Mock).mockRejectedValue(
      new Error("Network Error")
    );

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current();
    });

    expect(mockHandleResetAuth).not.toHaveBeenCalled();
    expect(mockNotify).toHaveBeenCalledWith(ERROR_MESSAGE);
  });

  it("should use custom logoutReq and notify if provided", async () => {
    const customLogoutReq = vi.fn().mockResolvedValue({ success: true });
    const customNotify = vi.fn();

    const { result } = renderHook(() =>
      useLogout({
        logoutReq: customLogoutReq,
        notify: customNotify,
      })
    );

    await act(async () => {
      await result.current();
    });

    expect(customLogoutReq).toHaveBeenCalledWith(mockSend);
    expect(customNotify).toHaveBeenCalledWith("Logged out successfully!");
  });
});
