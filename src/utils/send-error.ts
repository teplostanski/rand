import type { Response } from "express";

export const sendError = (res: Response, status: number, message: string) => {
  res.status(status).type("text/plain").send(message);
};
