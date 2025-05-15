import { beforeEach, describe, expect, it } from "vitest";
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
});
