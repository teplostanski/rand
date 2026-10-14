import { Router } from "express";
import { INFO, ROUTES } from "../constants.js";
import { formatServiceInfo } from "../utils/format-service-info.js";

export const rootRouter = Router();

rootRouter.get(ROUTES.root, (_req, res) => {
  res.type('text/plain').send(formatServiceInfo(INFO));
});
