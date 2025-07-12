import { describe, it, expect, beforeEach } from "vitest";
import JwtUtil from "./JwtUtil.js";

describe("JwtUtil", () => {
  let jwtUtil: JwtUtil;
  const secret = "mysecret";
  const payload = { sub: "123", name: "Alice" };
  const expiresAtInSec = Math.floor(Date.now() / 1000) + 3600;

  beforeEach(() => {
    jwtUtil = new JwtUtil();
  });

  it("should sign a JWT and return a token string", async () => {
    const token = await jwtUtil.sign(payload, secret, expiresAtInSec);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);
  });

  it("should verify a valid JWT and return the payload", async () => {
    const token = await jwtUtil.sign(payload, secret, expiresAtInSec);
    const verifiedPayload = await jwtUtil.verify<typeof payload>(token, secret);
    expect(verifiedPayload.sub).toBe(payload.sub);
    expect(verifiedPayload.name).toBe(payload.name);
  });

  it("should throw if verifying an invalid token", async () => {
    await expect(
      jwtUtil.verify("invalid.token.here", secret)
    ).rejects.toThrow();
  });
});
