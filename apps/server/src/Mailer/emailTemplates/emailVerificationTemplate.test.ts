import { describe, expect, it } from "vitest";
import { EmailTemplate, emailVerificationTemplate } from "./index.js";

describe("emailVerificationTemplate.ts", () => {
  it("should create template correctly", () => {
    const result = emailVerificationTemplate(5000);

    expect(result).toEqual({
      subject: "Email verification",
      text: "Verification code: " + 5000,
      html: "Verification code: " + 5000,
    } as EmailTemplate);
  });
});
