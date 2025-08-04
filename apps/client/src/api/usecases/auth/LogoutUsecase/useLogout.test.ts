import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import useAuthContext from "../../../../hooks/useAuthContext/useAuthContext.js";
import usePrivateHttp from "../../../../hooks/usePrivateHttp/usePrivateHttp.js";
import { renderHook } from "@testing-library/react";
import useLogout, {
  LOGOUT_ERROR_MESSAGE,
  LOGOUT_MUTATION_KEY,
} from "./useLogout.js";
import { useMutation } from "@tanstack/react-query";

vi.mock("@tanstack/react-query");
vi.mock("../../../../hooks/useAuthContext/useAuthContext.js");
vi.mock("../../../../hooks/usePrivateHttp/usePrivateHttp.js");

describe("useLogout.ts", () => {
  let notify: Mock;
  let handleResetAuth: Mock;

  const authUserId = "userid";

  let sendFn: Mock;

  beforeEach(() => {
    notify = vi.fn();
    sendFn = vi.fn();

    handleResetAuth = vi.fn();

    (useMutation as Mock).mockImplementation(({ mutationFn }) => ({
      mutateAsync: vi.fn().mockImplementation(() => mutationFn()),
    }));

    (usePrivateHttp as Mock).mockReturnValue({
      send: sendFn,
    });

    (useAuthContext as Mock).mockReturnValue({
      user: { id: authUserId },
      handleResetAuth,
    });
  });

  it("should call useMutation with the arguments", async () => {
    const { result } = renderHook(() => useLogout());
    await result.current();
    expect(useMutation).toHaveBeenCalled();
    const calledOptions = (useMutation as Mock).mock.calls[0][0];
    expect(calledOptions.mutationKey).toEqual([LOGOUT_MUTATION_KEY]);
    expect(typeof calledOptions.mutationFn).toBe("function");
  });

  it("should call sendFn with the correct arguments", async () => {
    const { result } = renderHook(() => useLogout());
    await result.current();
    expect(sendFn).toHaveBeenCalledWith("/auth/logout", { method: "post" });
  });

  it("should reset auth if request is successfull", async () => {
    sendFn.mockResolvedValue({ success: true });
    const { result } = renderHook(() => useLogout({ notify }));
    await result.current();
    expect(handleResetAuth).toHaveBeenCalled();
  });

  it("should not reset auth and notify user if request is unsuccessfull", async () => {
    sendFn.mockResolvedValue({ success: false });
    const { result } = renderHook(() => useLogout({ notify }));
    await result.current();
    expect(handleResetAuth).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("should notify the user with the correct message if the request threw an error", async () => {
    sendFn.mockImplementation(() => {
      throw new Error("error");
    });

    const { result } = renderHook(() => useLogout({ notify }));

    try {
      await result.current();
    } catch (error) {
      expect(handleResetAuth).not.toHaveBeenCalled();
      expect(notify).toHaveBeenCalledWith(LOGOUT_ERROR_MESSAGE);
    }
  });
});
