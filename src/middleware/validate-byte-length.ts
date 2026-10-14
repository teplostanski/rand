import type { RequestHandler } from "express";
import { DEFAULT_BYTE_LENGTH, MAX_BYTE_LENGTH } from "../constants.js";
import { sendError } from "../utils/send-error.js";

export const validateByteLength: RequestHandler = (req, res, next) => {
  const byteLength = Number(req.params.byteLength ?? DEFAULT_BYTE_LENGTH);

  if (
    !Number.isSafeInteger(byteLength) ||
    byteLength <= 0 ||
    byteLength > MAX_BYTE_LENGTH
  ) {
    sendError(res, 400, "Invalid length");
    return;
  }

  res.locals.byteLength = byteLength;
  next();
};
