import envConfig from "../../../config.js";
import getEmailVerificationTemplate from "../../../Mailer/emailTemplates/emailVerificationTemplate.js";
import { testMailer } from "../../../Mailer/index.js";
import SendAccountVerificationEmailUsecase from "./SendAccountVerificationEmailUsecase.js";

const sendAccountVerificationEmail = new SendAccountVerificationEmailUsecase(
  envConfig.NODE_ENV === "development" ? testMailer : testMailer,
  getEmailVerificationTemplate
);

export { sendAccountVerificationEmail };
