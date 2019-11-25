import { Secret, SignOptions } from "jsonwebtoken";
interface JwtAuthPayload {}

export const secretKey = "verySecretKey";
export const signOptions: SignOptions = {
  issuer: "Boss",
  expiresIn: "24h"
};
