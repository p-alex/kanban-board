import { describe, it, expect, vi } from "vitest";
import { ServerResponseDto } from "@kanban/dtos/ServerResponseDto";
import LogoutUsecase from "./LogoutUsecase.js";
import BestHttpInstance from "../../../../utils/BestHttp/BestHttpInstance.js";

describe("LogoutUsecase", () => {
  const logoutUsecase = new LogoutUsecase();

  it("should return success when sendRequest resolves successfully", async () => {
    const mockSendRequest: BestHttpInstance["send"] = vi
      .fn()
      .mockResolvedValue({
        success: true,
      } as unknown as ServerResponseDto<null>);

    const result = await logoutUsecase.execute(mockSendRequest);

    expect(mockSendRequest).toHaveBeenCalledWith("/auth/logout", {
      method: "post",
      withCredentials: true,
    });
    expect(result).toEqual({ success: true });
  });

  it("should return success: false when sendRequest throws an error", async () => {
    const mockSendRequest: BestHttpInstance["send"] = vi
      .fn()
      .mockRejectedValue(new Error("Network Error"));

    const result = await logoutUsecase.execute(mockSendRequest);

    expect(mockSendRequest).toHaveBeenCalledWith("/auth/logout", {
      method: "post",
      withCredentials: true,
    });
    expect(result).toEqual({ success: false });
  });

  it("should call sendRequest with correct parameters", async () => {
    const mockSendRequest: BestHttpInstance["send"] = vi
      .fn()
      .mockResolvedValue({
        success: true,
      } as unknown as ServerResponseDto<null>);

    await logoutUsecase.execute(mockSendRequest);

    expect(mockSendRequest).toHaveBeenCalledTimes(1);
    expect(mockSendRequest).toHaveBeenCalledWith("/auth/logout", {
      method: "post",
      withCredentials: true,
    });
  });
});
