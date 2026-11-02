import type { RequestHandler } from "express";
import { sendError } from "../utils/send-error.js";

export type LengthOptions = {
  param: "byteLength" | "nanoidLength";
  defaultValue: number;
  max: number;
};

export const validateLength =
  (options: LengthOptions): RequestHandler =>
  (req, res, next) => {
    const length = Number(req.params[options.param] ?? options.defaultValue);

    if (!Number.isSafeInteger(length) || length <= 0 || length > options.max) {
      sendError(res, 400, "Invalid length");
      return;
    }

    res.locals[options.param] = length;

    next();
  };
