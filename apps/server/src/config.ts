import dotenv from "dotenv";
dotenv.config();

const envConfig = {
  PORT: process.env.PORT || 5000,
};

export default envConfig;
