import { EmailTemplate } from "./emailTemplates/index.js";
import { ITransporter } from "./MailTransporters/index.js";

class Mailer {
  constructor(private readonly _mailTransporter: ITransporter) {}

  send = async (emailTemplate: EmailTemplate, to: string) => {
    await this._mailTransporter.sendMail(emailTemplate, to);
  };
}

export default Mailer;
