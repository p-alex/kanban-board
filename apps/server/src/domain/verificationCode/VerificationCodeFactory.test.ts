import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import VerificationCodeFactory from "./VerificationCodeFactory.js";
import { CryptoUtil, DateUtil, TimeConverter } from "@kanban/utils";
import IVerificationCode from "./IVerificationCode.js";

describe("VerificationCodeFactory.ts", () => {
  let verificationCodeFactory: VerificationCodeFactory;
  let cryptoUtilMock: Mocked<CryptoUtil>;
  let dateUtilMock: Mocked<DateUtil>;
  let timeConverterMock: Mocked<TimeConverter>;

  const hashedCode = "hashed_code";

  beforeEach(() => {
    cryptoUtilMock = {
      sha256: vi.fn().mockReturnValue(hashedCode),
      randomUUID: vi.fn().mockReturnValue("uuid"),
    } as unknown as Mocked<CryptoUtil>;

    dateUtilMock = {
      getUtcOfNow: vi.fn().mockReturnValue("created_at"),
      toUtcString: vi.fn().mockReturnValue("expires_at"),
      now: vi.fn(),
    } as unknown as Mocked<DateUtil>;

    timeConverterMock = {
      toMs: vi.fn().mockReturnValue(0),
    } as unknown as Mocked<TimeConverter>;

    verificationCodeFactory = new VerificationCodeFactory(
      cryptoUtilMock,
      dateUtilMock,
      timeConverterMock
    );
  });

  it("should create a verification code correctly", () => {
    const result = verificationCodeFactory.create(
      "user_id",
      "123",
      "email_verification"
    );

    expect(cryptoUtilMock.sha256).toHaveBeenCalledWith("123");
    expect(cryptoUtilMock.randomUUID).toHaveBeenCalledTimes(1);
    expect(dateUtilMock.getUtcOfNow).toHaveBeenCalledTimes(1);
    expect(dateUtilMock.getUtcOfNow).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      id: "uuid",
      user_id: "user_id",
      code: hashedCode,
      type: "email_verification",
      created_at: "created_at",
      expires_at: "expires_at",
    } as IVerificationCode);
  });
});
