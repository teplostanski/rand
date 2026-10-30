import { Router } from "express";
import { INFO, ROUTES } from "../constants.js";
import { formatServiceHtml } from "../utils/format-service-html.js";
import { formatServiceInfo } from "../utils/format-service-info.js";

export const rootRouter = Router();

rootRouter.get(ROUTES.root, (_req, res) => {
  res.vary("User-Agent");
  if (res.locals.undevice.isCrawler && !res.locals.undevice.isRawClient) {
    res.type("html").send(formatServiceHtml(INFO));
    return;
  }
  res
    .type("text/plain")
    .send(formatServiceInfo(INFO, res.locals.undevice.isRawClient));
});
