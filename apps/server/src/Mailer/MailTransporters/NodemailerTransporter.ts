import nodemailer from "nodemailer";
import { EmailTemplate } from "../emailTemplates/index.js";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { MailApi } from "../MailApis/index.js";
import { ITransporter } from "./index.js";

export type NodemailerTransporterType = nodemailer.Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
>;

class NodemailerTransporter implements ITransporter {
  private readonly _transporter: NodemailerTransporterType;

  constructor(
    private readonly _mailApi: MailApi,
    private readonly _from: string
  ) {
    this._transporter = nodemailer.createTransport(this._mailApi);
  }

  sendMail = async (emailTemplate: EmailTemplate, to: string) => {
    await this._transporter.sendMail({
      ...emailTemplate,
      from: this._from,
      to,
    });
  };
}

export default NodemailerTransporter;
