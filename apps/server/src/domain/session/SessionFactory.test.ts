import { describe, it, expect, beforeEach, vi, Mocked } from "vitest";
import SessionFactory from "./SessionFactory.js";
import ISession from "./ISession.js";
import { CryptoUtil, DateUtil } from "@kanban/utils";

describe("SessionFactory", () => {
  let cryptoUtil: Mocked<CryptoUtil>;
  let dateUtil: Mocked<DateUtil>;
  let sessionFactory: SessionFactory;

  const sessionHashSecret = "session-secret";
  const sessionExpireTimeInMs = 15 * 60 * 1000;

  beforeEach(() => {
    cryptoUtil = {
      randomUUID: vi.fn(),
      hmacSHA256: vi.fn(),
    } as unknown as Mocked<CryptoUtil>;

    dateUtil = {
      getUtcOfNow: vi.fn(),
      now: vi.fn(),
      toUtcString: vi.fn(),
    } as unknown as Mocked<DateUtil>;

    sessionFactory = new SessionFactory(
      cryptoUtil,
      dateUtil,
      sessionHashSecret,
      sessionExpireTimeInMs
    );
  });

  it("should create a session with expected properties", () => {
    // Arrange
    const userId = "user-123";
    const token = "some-refresh-token";

    const fakeUUID = "uuid-1234";
    const hashedToken = "hashed-token-abc";
    const nowTimestamp = 1000_000;
    const createdAt = "2025-07-09T12:00:00Z";
    const expiresAt = "2025-07-09T12:15:00Z";

    cryptoUtil.randomUUID.mockReturnValue(fakeUUID as any);
    cryptoUtil.hmacSHA256.mockReturnValue(hashedToken);
    dateUtil.getUtcOfNow.mockReturnValue(createdAt);
    dateUtil.now.mockReturnValue(nowTimestamp);
    dateUtil.toUtcString.mockReturnValue(expiresAt);

    // Act
    const session: ISession = sessionFactory.create(userId, token);

    // Assert
    expect(cryptoUtil.randomUUID).toHaveBeenCalled();
    expect(cryptoUtil.hmacSHA256).toHaveBeenCalledWith(
      token,
      sessionHashSecret
    );
    expect(dateUtil.getUtcOfNow).toHaveBeenCalledTimes(2);
    expect(dateUtil.now).toHaveBeenCalled();
    expect(dateUtil.toUtcString).toHaveBeenCalledWith(
      nowTimestamp + sessionExpireTimeInMs
    );

    expect(session).toEqual({
      id: fakeUUID,
      user_id: userId,
      token: hashedToken,
      created_at: createdAt,
      last_accessed_at: createdAt,
      expires_at: expiresAt,
    });
  });
});
