import { randomBytes } from "node:crypto";
import type { ENCODINGS } from "../constants.js";

export type Encoding = (typeof ENCODINGS)[keyof typeof ENCODINGS];

export const generateRandomString = (
  byteLength: number,
  encoding: Encoding,
) => {
  return randomBytes(byteLength).toString(encoding);
};
