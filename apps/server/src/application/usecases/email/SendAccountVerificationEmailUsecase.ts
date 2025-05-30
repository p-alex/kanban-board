import { GetEmailVerificationTemplate } from "../../../Mailer/emailTemplates/emailVerificationTemplate.js";
import Mailer from "../../../Mailer/Mailer.js";

class SendAccountVerificationEmailUsecase {
  constructor(
    private readonly _mailer: Mailer,
    private readonly _getTemplate: GetEmailVerificationTemplate
  ) {}

  execute = async (code: string, to: string) => {
    await this._mailer.send(this._getTemplate(code), to);
  };
}

export default SendAccountVerificationEmailUsecase;
