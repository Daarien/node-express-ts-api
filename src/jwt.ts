import { secretType } from "express-jwt";
import { SignOptions } from "jsonwebtoken";

export const secretKey: secretType = "verySecretKey";
export const signOptions: SignOptions = {
  issuer: "Boss",
  expiresIn: "24h"
};
