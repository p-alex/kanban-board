import envConfig from "../config.js";
import getTestMailApi from "./MailApis/getTestMailApi.js";
import Mailer from "./Mailer.js";
import NodemailerTransporter from "./MailTransporters/NodemailerTransporter.js";

const testMailer = new Mailer(
  new NodemailerTransporter(
    getTestMailApi(envConfig.TEST_MAIL_API_USER, envConfig.TEST_MAIL_API_PASS),
    envConfig.APP_EMAIL_SENDER
  )
);

export { testMailer };
