import express from "express";
import { ROUTES } from "./constants.js";
import { base64Router } from "./routes/base64.js";
import { base64urlRouter } from "./routes/base64url.js";
import { healthRouter } from "./routes/health.js";
import { hexRouter } from "./routes/hex.js";
import { rootRouter } from "./routes/root.js";
import { sendError } from "./utils/send-error.js";

export const app = express();

app.disable("x-powered-by");
app.set("json spaces", 2);

if (process.env.TRUST_PROXY?.trim()) {
  app.set("trust proxy", process.env.TRUST_PROXY);
}

app.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("X-Written-By", "human");
  next();
});

app.use(healthRouter);
app.use(ROUTES.root, rootRouter);
app.use(ROUTES.hex, hexRouter);
app.use(ROUTES.base64, base64Router);
app.use(ROUTES.base64url, base64urlRouter);

app.use((req, res) => {
  sendError(res, 404, `Cannot ${req.method} ${req.path}`);
});
