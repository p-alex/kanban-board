import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import VerifyUserUsecase from "./VerifyUserUsecase.js";
import BestHttpInstance from "../../../../utils/BestHttp/BestHttpInstance.js";
import BestHttpException from "../../../../utils/BestHttp/exceptions/BestHttpResponseException.js";

describe("VerifyUserUsecase.ts", () => {
  let httpMock: Mocked<BestHttpInstance>;
  let verifyUserUsecase: VerifyUserUsecase;
  const code = "123";

  beforeEach(() => {
    httpMock = {
      send: vi.fn(),
    } as unknown as Mocked<BestHttpInstance>;

    verifyUserUsecase = new VerifyUserUsecase(httpMock);
  });

  it("should call send function with correct arguments", async () => {
    await verifyUserUsecase.execute(code);

    expect(httpMock.send).toHaveBeenCalledWith("/users/verify", {
      method: "post",
      body: { verification_code: code },
    });
  });

  it("should return return correct object on success", async () => {
    httpMock.send.mockResolvedValue({
      success: true,
      data: null,
      errors: [],
      status: 200,
    });

    const result = await verifyUserUsecase.execute(code);

    expect(result).toEqual({ success: true, errors: [] });
  });

  it("should return return correct object on fail", async () => {
    httpMock.send.mockResolvedValue({
      success: false,
      data: null,
      errors: ["error"],
      status: 200,
    });

    const result = await verifyUserUsecase.execute(code);

    expect(result).toEqual({ success: false, errors: ["error"] });
  });

  it("should return return correct object on thrown BestHttpException", async () => {
    httpMock.send.mockRejectedValue(
      new BestHttpException(400, ["besthttperror"], {
        errors: ["error"],
      })
    );

    const result = await verifyUserUsecase.execute(code);

    expect(result).toEqual({ success: false, errors: ["error"] });
  });

  it("should return return correct object on thrown Error", async () => {
    httpMock.send.mockRejectedValue(new Error("error"));

    const result = await verifyUserUsecase.execute(code);

    expect(result).toEqual({
      success: false,
      errors: ["Account verification failed. Please try again later."],
    });
  });
});
