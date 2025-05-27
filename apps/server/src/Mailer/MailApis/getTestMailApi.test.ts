import { describe, expect, it } from "vitest";
import { getTestMailApi, MailApi } from "./index.js";

describe("getTestMailApi.ts", () => {
  it("should return correct api config", () => {
    const result = getTestMailApi("user", "pass");

    expect(result).toEqual({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "user",
        pass: "pass",
      },
    } as MailApi);
  });
});
