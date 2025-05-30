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
  CACHE_CONFIG: {
    USERNAME: process.env.CACHE_CONFIG_USERNAME!,
    PASSWORD: process.env.CACHE_CONFIG_PASSWORD!,
    HOST: process.env.CACHE_CONFIG_HOST!,
    PORT: parseInt(process.env.CACHE_CONFIG_PORT!),
  },
  ENCRYPTION_SECRET: {
    EMAIL: process.env.ENCRYPTION_SECRET_EMAIL!,
  },
  HASH_SECRET: {
    VERIFICATION_CODE: process.env.HASH_SECRET_VERIFICATION_CODE!,
    EMAIL: process.env.HASH_SECRET_EMAIL!,
  },
  SALT_ROUNDS: {
    PASSWORD: parseInt(process.env.PASSWORD_SALT_ROUNDS!),
  },
  EMAIL_API: {
    SENDER: process.env.EMAIL_API_SENDER!,
    USER: process.env.EMAIL_API_USER!,
    PASS: process.env.EMAIL_API_PASS!,
  },
};

export default envConfig;
