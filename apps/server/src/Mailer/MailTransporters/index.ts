import { EmailTemplate } from "../emailTemplates/index.js";

export interface ITransporter {
  sendMail: (emailTemplate: EmailTemplate, to: string) => Promise<void>;
}
