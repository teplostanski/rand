import type { Response } from "express";
import { FORMATS } from "../constants.js";

export const sendFormatted = (res: Response, data: unknown, text: string) => {
  const format = res.locals.format;

  if (format === FORMATS.json || format === FORMATS.prettyJson) {
    const spaces = format === FORMATS.prettyJson ? 2 : undefined;

    return res
      .type("application/json")
      .send(JSON.stringify(data, null, spaces));
  }

  return res.type("text/plain").send(text);
};
