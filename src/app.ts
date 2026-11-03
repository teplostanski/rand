import { fileURLToPath } from "node:url";
import express from "express";
import { isBot } from "isbot";
import { undevice } from "undevice/express";
import { ROUTES } from "./constants.js";
import { base64Router } from "./routes/base64.js";
import { base64urlRouter } from "./routes/base64url.js";
import { healthRouter } from "./routes/health.js";
import { hexRouter } from "./routes/hex.js";
import { nanoidRouter } from "./routes/nanoid.js";
import { rootRouter } from "./routes/root.js";
import { uuidRouter } from "./routes/uuid.js";
import { uuidv7Router } from "./routes/uuidv7.js";
import { sendError } from "./utils/send-error.js";

export const app = express();

app.disable("x-powered-by");

app.get("/og-image.png", (_req, res) => {
  res.sendFile(
    fileURLToPath(new URL("../assets/og/og-image.png", import.meta.url)),
  );
});

app.use(
  express.static(
    fileURLToPath(new URL("../assets/favicons/", import.meta.url)),
    {
      index: false,
      redirect: false,
    },
  ),
);

if (process.env.TRUST_PROXY?.trim()) {
  app.set("trust proxy", process.env.TRUST_PROXY);
}

app.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  res.set("X-Written-By", "human");
  next();
});

const rawClients = ["curl", "wget"];

export const undeviceMiddleware = undevice({
  isRawClient: rawClients,
  isCrawler: {
    detect: isBot,
    exclude: rawClients,
  },
});

app.use(undeviceMiddleware);

app.use(healthRouter);
app.use(ROUTES.root, rootRouter);
app.use(ROUTES.hex, hexRouter);
app.use(ROUTES.base64, base64Router);
app.use(ROUTES.base64url, base64urlRouter);
app.use(ROUTES.nanoid, nanoidRouter);
app.use(uuidRouter);
app.use(uuidv7Router);

app.use((req, res) => {
  sendError(res, 404, `Cannot ${req.method} ${req.path}`);
});
