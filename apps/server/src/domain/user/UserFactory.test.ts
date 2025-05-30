import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CryptoUtil, DateUtil } from "@kanban/utils";
import UserFactory, { UserFactoryData } from "./UserFactory.js";
import IUser from "./IUser.js";

describe("UserFactory.ts", () => {
  const cryptoMock = {
    randomUUID: vi.fn().mockReturnValue("uuid"),
    encrypt: vi.fn().mockReturnValue("encryptedText"),
    slowHash: vi.fn().mockResolvedValue("slowHash"),
    hmacSHA256: vi.fn().mockReturnValue("sha256"),
  } as unknown as CryptoUtil;

  const utcNow = new DateUtil().getUtcOfNow();

  const dateMock = {
    getUtcOfNow: vi.fn().mockReturnValue(utcNow),
  } as unknown as DateUtil;

  const emailEncryptionSecret = "emailENCRYPTIONSecret";
  const emailHashSecret = "emailHASHSecret";
  const passwordSaltRounds = 10;

  let userFactory: UserFactory;

  beforeEach(() => {
    userFactory = new UserFactory(
      cryptoMock,
      dateMock,
      emailEncryptionSecret,
      emailHashSecret,
      passwordSaltRounds
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create a user correctly", async () => {
    const userData: UserFactoryData = {
      email: "email",
      password: "password",
      username: "username",
    };

    const user = await userFactory.create(userData);

    expect(cryptoMock.randomUUID).toHaveBeenCalled();
    expect(cryptoMock.encrypt).toHaveBeenCalledWith(
      userData.email,
      emailEncryptionSecret
    );
    expect(cryptoMock.slowHash).toHaveBeenCalledWith(
      userData.password,
      passwordSaltRounds
    );
    expect(cryptoMock.hmacSHA256).toHaveBeenCalledWith(
      userData.email,
      emailHashSecret
    );
    expect(dateMock.getUtcOfNow).toHaveBeenCalled();

    expect(user).toEqual({
      id: "uuid",
      username: userData.username,
      encrypted_email: "encryptedText",
      hashed_email: "sha256",
      password: "slowHash",
      is_verified: false,
      created_at: utcNow,
    } as IUser);
  });
});
