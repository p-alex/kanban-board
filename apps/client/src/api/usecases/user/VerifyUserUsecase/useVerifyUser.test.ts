import { beforeEach, describe, expect, it, Mock, Mocked, vi } from "vitest";
import VerifyUserUsecase from "./VerifyUserUsecase.js";
import { renderHook } from "@testing-library/react";
import useVerifyUser from "./useVerifyUser.js";
import { useNavigate } from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("useVerifyUser.ts", () => {
  let verifyUserUsecaseMock: Mocked<VerifyUserUsecase>;
  let notifyMock: Mock;
  let navigateMock: Mock;

  const code = "23148329";

  beforeEach(() => {
    vi.clearAllMocks();
    verifyUserUsecaseMock = {
      execute: vi.fn(),
    } as unknown as Mocked<VerifyUserUsecase>;
    notifyMock = vi.fn();
    navigateMock = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(navigateMock);
  });

  it("should call verifyUserUsecase with correct arguments", async () => {
    verifyUserUsecaseMock.execute.mockResolvedValue({
      success: true,
      errors: [],
    });

    const { result } = renderHook(() =>
      useVerifyUser({
        verifyUserUsecase: verifyUserUsecaseMock,
        notify: notifyMock,
      })
    );

    await result.current(code);

    expect(verifyUserUsecaseMock.execute).toHaveBeenCalledWith(code);
  });

  it("should notify if success", async () => {
    verifyUserUsecaseMock.execute.mockResolvedValue({
      success: true,
      errors: [],
    });

    const { result } = renderHook(() =>
      useVerifyUser({
        verifyUserUsecase: verifyUserUsecaseMock,
        notify: notifyMock,
      })
    );

    await result.current(code);

    expect(notifyMock).toHaveBeenCalled();
  });

  it("on success, should redirect to /login", async () => {
    verifyUserUsecaseMock.execute.mockResolvedValue({
      success: true,
      errors: [],
    });

    const { result } = renderHook(() =>
      useVerifyUser({
        verifyUserUsecase: verifyUserUsecaseMock,
        notify: notifyMock,
      })
    );

    await result.current(code);

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  it("should notify if fail", async () => {
    verifyUserUsecaseMock.execute.mockResolvedValue({
      success: false,
      errors: ["error"],
    });

    const { result } = renderHook(() =>
      useVerifyUser({
        verifyUserUsecase: verifyUserUsecaseMock,
        notify: notifyMock,
      })
    );

    await result.current(code);

    expect(notifyMock).toHaveBeenCalledWith("error");
  });

  it("should return correct object on success", async () => {
    verifyUserUsecaseMock.execute.mockResolvedValue({
      success: true,
      errors: [],
    });

    const { result } = renderHook(() =>
      useVerifyUser({
        verifyUserUsecase: verifyUserUsecaseMock,
        notify: notifyMock,
      })
    );

    const res = await result.current(code);

    expect(res).toEqual({ success: true });
  });

  it("should return correct object on fail", async () => {
    verifyUserUsecaseMock.execute.mockResolvedValue({
      success: false,
      errors: [],
    });

    const { result } = renderHook(() =>
      useVerifyUser({
        verifyUserUsecase: verifyUserUsecaseMock,
        notify: notifyMock,
      })
    );

    const res = await result.current(code);

    expect(res).toEqual({ success: false });
  });
});
