import { afterEach, describe, expect, it, vi } from "vitest";
import NodemailerTransporter from "./NodemailerTransporter.js";
import {
  emailTemplateFixture,
  MailApiFixture,
} from "../../__fixtures__/email/index.js";

const sendMailMock = vi.fn();

vi.mock("nodemailer", () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: sendMailMock,
      })),
    },
  };
});

describe("NodemailerTransporter.ts", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const from = "email@from.com";
  const to = "email@email.com";

  it("should send email correctly", async () => {
    const transporter = new NodemailerTransporter(MailApiFixture, from);

    await transporter.sendMail(emailTemplateFixture, to);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith({
      ...emailTemplateFixture,
      from,
      to,
    });
  });
});
