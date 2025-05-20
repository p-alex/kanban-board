import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CryptoUtil, DateUtil } from "@kanban/utils";
import UserFactory, { UserFactoryData } from "./UserFactory.js";

describe("UserFactory.ts", () => {
  const cryptoMock = {
    randomUUID: vi.fn().mockReturnValue("uuid"),
    encrypt: vi.fn().mockReturnValue("encryptedText"),
    slowHash: vi.fn().mockResolvedValue("slowHash"),
  } as unknown as CryptoUtil;

  const utcNow = new DateUtil().getUtcOfNow();

  const dateMock = {
    getUtcOfNow: vi.fn().mockReturnValue(utcNow),
  } as unknown as DateUtil;

  const emailSecret = "emailSecret";
  const passwordSaltRounds = 10;

  let userFactory: UserFactory;

  beforeEach(() => {
    userFactory = new UserFactory(
      cryptoMock,
      dateMock,
      emailSecret,
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
      emailSecret
    );
    expect(cryptoMock.slowHash).toHaveBeenCalledWith(
      userData.password,
      passwordSaltRounds
    );
    expect(dateMock.getUtcOfNow).toHaveBeenCalled();

    expect(user).toEqual({
      id: "uuid",
      username: userData.username,
      email: "encryptedText",
      password: "slowHash",
      created_at: utcNow,
    });
  });
});
