import dotenv from "dotenv";
dotenv.config();

const envConfig = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 5000,
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL!,
  DATABASE_CONFIG: {
    USER: process.env.DATABASE_CONFIG_USER!,
    HOST: process.env.DATABASE_CONFIG_HOST!,
    PASS: process.env.DATABASE_CONFIG_PASS!,
    NAME: process.env.DATABASE_CONFIG_NAME!,
    PORT: parseInt(process.env.DATABASE_CONFIG_PORT!),
  },
  APP_EMAIL_SENDER: process.env.APP_EMAIL_SENDER!,
  TEST_MAIL_API_USER: process.env.TEST_MAIL_API_USER!,
  TEST_MAIL_API_PASS: process.env.TEST_MAIL_API_PASS!,
  PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS!),
  EMAIL_ENCRYPTION_SECRET: process.env.EMAIL_ENCRYPTION_SECRET!,
  VERIFICATION_CODE_ENCRYPTION_SECRET:
    process.env.VERIFICATION_CODE_ENCRYPTION_SECRET!,
};

export default envConfig;
