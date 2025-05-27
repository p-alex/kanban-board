import envConfig from "../../../config.js";
import getEmailVerificationTemplate from "../../../Mailer/emailTemplates/emailVerificationTemplate.js";
import { testMailer } from "../../../Mailer/index.js";
import SendAccountVerificationEmail from "./sendAccountVerificationEmail.js";

const sendAccountVerificationEmail = new SendAccountVerificationEmail(
  envConfig.NODE_ENV === "development" ? testMailer : testMailer,
  getEmailVerificationTemplate
).execute;

export type SendAccountVerificationEmailUsecase =
  SendAccountVerificationEmail["execute"];

export { sendAccountVerificationEmail };
