vi.mock("bcryptjs", () => {
  return {
    default: {
      hash: vi.fn(
        async (text: string, salt: number) => `mock-hash-${text}-${salt}`
      ),
      compare: vi.fn(async (text: string, hash: string) => hash.includes(text)),
    },
  };
});

import { beforeEach, describe, expect, it, vi } from "vitest";

import CryptoUtil from "./CryptoUtil.js";

describe("CryptoUtil.ts", () => {
  let cryptoUtil: CryptoUtil;

  beforeEach(() => {
    cryptoUtil = new CryptoUtil();
  });

  it("randomUUID should return a valid uuid", () => {
    const uuid = cryptoUtil.randomUUID();

    const uuidRegex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

    const isValidUUID = uuidRegex.test(uuid);

    expect(isValidUUID).toBe(true);
  });

  it("slowHash should return a mocked hash", async () => {
    const result = await cryptoUtil.slowHash("my-password", 10);
    expect(result).toBe("mock-hash-my-password-10");
  });

  it("verifySlowHash should return true if text is in hash", async () => {
    const result = await cryptoUtil.verifySlowHash("abc", "mock-hash-of-abc");
    expect(result).toBe(true);
  });

  it("verifySlowHash should return false if text is not in hash", async () => {
    const result = await cryptoUtil.verifySlowHash("abc", "mock-hash-of-def");
    expect(result).toBe(false);
  });

  it("encrypts and decrypts a string correctly", () => {
    const secret = "secret";
    const text = "text";

    const encrypted = cryptoUtil.encrypt(text, secret);

    const decrypted = cryptoUtil.decrypt(encrypted, secret);

    expect(decrypted).toBe(text);
  });
});
