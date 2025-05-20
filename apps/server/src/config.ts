import dotenv from "dotenv";
dotenv.config();

const envConfig = {
  PORT: process.env.PORT || 5000,
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL!,
  DATABASE: {
    USER: process.env.DATABASE_USER!,
    HOST: process.env.DATABASE_HOST!,
    PASS: process.env.DATABASE_PASS!,
    NAME: process.env.DATABASE_NAME!,
    PORT: parseInt(process.env.DATABASE_PORT!),
  },
  PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS!),
  EMAIL_ENCRYPTION_SECRET: process.env.EMAIL_ENCRYPTION_SECRET!,
};

export default envConfig;
