import { describe, expect, it, Mocked, vi } from "vitest";
import SendAccountVerificationEmail from "./sendAccountVerificationEmail.js";
import Mailer from "../../../Mailer/Mailer.js";
import { EmailTemplate } from "../../../Mailer/emailTemplates/index.js";

describe("sendAccountVerificationEmail.ts", () => {
  const mockMailer = {
    send: vi.fn(),
  } as unknown as Mocked<Mailer>;

  const emailTemplate: EmailTemplate = {
    subject: "subject",
    text: "text",
    html: "html",
  };

  const code = 5000;

  const getTemplate = vi.fn().mockReturnValue(emailTemplate);

  it("should send email correctly", async () => {
    const sendAccountVarification = new SendAccountVerificationEmail(
      mockMailer,
      getTemplate
    );

    await sendAccountVarification.execute(code, "email@email.com");

    expect(mockMailer.send).toHaveBeenCalledWith(
      emailTemplate,
      "email@email.com"
    );
  });
});
