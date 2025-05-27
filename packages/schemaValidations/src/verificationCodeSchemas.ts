import { z } from "zod";

const verificationCodeSchema = z
  .string({ required_error: "Verification code is required" })
  .length(8);

export default { verificationCodeSchema };
