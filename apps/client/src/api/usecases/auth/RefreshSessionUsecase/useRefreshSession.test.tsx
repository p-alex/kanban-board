import { renderHook, act } from "@testing-library/react";
import useRefreshSession from "./useRefreshSession";
import refreshSessionUsecase from "./index";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext";
import { Mock } from "vitest";

vi.mock("../../../../hooks/useAuthContext/useAuthContext");
vi.mock("./index");

describe("useRefreshSession", () => {
  const mockHandleSetAuth = vi.fn();
  const mockHandleResetAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthContext as Mock).mockReturnValue({
      handleSetAuth: mockHandleSetAuth,
      handleResetAuth: mockHandleResetAuth,
    });
  });

  it("calls handleSetAuth when authData is returned", async () => {
    const fakeAuthData = {
      user: { id: "123", name: "Test User" },
      accessToken: "newToken",
    };

    (refreshSessionUsecase.execute as Mock).mockResolvedValue({
      status: 200,
      authData: fakeAuthData,
    });

    const { result } = renderHook(() => useRefreshSession());

    await act(async () => {
      const returned = await result.current();
      expect(returned).toEqual(fakeAuthData);
    });

    expect(mockHandleSetAuth).toHaveBeenCalledWith(
      fakeAuthData.user,
      fakeAuthData.accessToken
    );
    expect(mockHandleResetAuth).not.toHaveBeenCalled();
  });

  it("calls handleResetAuth if 401 and no authData", async () => {
    (refreshSessionUsecase.execute as Mock).mockResolvedValue({
      status: 401,
      authData: null,
    });

    const { result } = renderHook(() => useRefreshSession());

    await act(async () => {
      await result.current();
    });

    expect(mockHandleResetAuth).toHaveBeenCalled();
    expect(mockHandleSetAuth).not.toHaveBeenCalled();
  });

  it("does nothing if no authData and status is not 401", async () => {
    (refreshSessionUsecase.execute as Mock).mockResolvedValue({
      status: 500,
      authData: null,
    });

    const { result } = renderHook(() => useRefreshSession());

    await act(async () => {
      await result.current();
    });

    expect(mockHandleSetAuth).not.toHaveBeenCalled();
    expect(mockHandleResetAuth).not.toHaveBeenCalled();
  });
});
