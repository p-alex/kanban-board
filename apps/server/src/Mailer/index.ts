import envConfig from "../config.js";
import getTestMailApi from "./MailApis/getTestMailApi.js";
import Mailer from "./Mailer.js";
import NodemailerTransporter from "./MailTransporters/NodemailerTransporter.js";

const testMailer = new Mailer(
  new NodemailerTransporter(
    getTestMailApi(envConfig.EMAIL_API.USER, envConfig.EMAIL_API.PASS),
    envConfig.EMAIL_API.SENDER
  )
);

export { testMailer };
