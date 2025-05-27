import { describe, expect, it, vi } from "vitest";
import Mailer from "./Mailer.js";
import { ITransporter } from "./MailTransporters/index.js";
import { emailTemplateFixture } from "../__fixtures__/email/index.js";

describe("Mailer.ts", () => {
  const mockTransporter = { sendMail: vi.fn() } as ITransporter;

  it("should send correctly", () => {
    const mailer = new Mailer(mockTransporter);

    mailer.send(emailTemplateFixture, "email");

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      emailTemplateFixture,
      "email"
    );
  });
});
