import { maxHeaderSize } from "node:http";
import { fileURLToPath } from "node:url";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { isBot } from "isbot";
import { undevice } from "undevice";
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

const rateLimitMax = Number(process.env.RATE_LIMIT_MAX ?? 60);
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);

for (const [name, value] of Object.entries({
  RATE_LIMIT_MAX: rateLimitMax,
  RATE_LIMIT_WINDOW_MS: rateLimitWindowMs,
})) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive safe integer`);
  }
}

export const app = Fastify({
  trustProxy: process.env.TRUST_PROXY?.trim() || false,
  logger:
    process.env.NODE_ENV === "development"
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:HH:MM:ss",
              ignore: "pid,hostname",
            },
          },
        }
      : true,
  routerOptions: {
    ignoreTrailingSlash: true,
    caseSensitive: false,
    maxParamLength: maxHeaderSize,
  },
});

app.addHook("onSend", async (_request, reply, payload) => {
  reply.header("Cache-Control", "no-store");
  reply.header("X-Written-By", "human");

  return payload;
});

await app.register(fastifyRateLimit, {
  global: false,
  max: rateLimitMax,
  timeWindow: rateLimitWindowMs,
  cache: 5_000,
});

app.addHook("onRequest", app.rateLimit());

app.addHook("onRequest", async (request, reply) => {
  if (
    Number(request.headers["content-length"] ?? 0) > 0 ||
    request.headers["transfer-encoding"] !== undefined
  ) {
    reply.header("Connection", "close");
    return sendError(reply, 413, "Request bodies are not supported.");
  }
});

app.setErrorHandler((error, _request, reply) => {
  if (
    error instanceof Error &&
    "statusCode" in error &&
    error.statusCode === 429
  ) {
    return sendError(reply, 429, "Too many requests. Try again later.");
  }

  throw error;
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "HEAD"],
  credentials: false,
  exposedHeaders: [
    "Retry-After",
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
  ],
});

app.register(fastifyStatic, {
  root: fileURLToPath(new URL("../assets/favicons/", import.meta.url)),
  index: false,
  redirect: false,
});

app.get("/og-image.png", (_req, reply) => {
  return reply.sendFile(
    "og-image.png",
    fileURLToPath(new URL("../assets/og/", import.meta.url)),
  );
});

app.register(healthRouter);

const rawClients = ["curl", "wget"];

export const deviceDetector = undevice({
  isRawClient: rawClients,
  isCrawler: {
    detect: isBot,
    exclude: rawClients,
  },
});

app.register(async (service) => {
  service.decorateRequest("undevice");

  service.addHook("onRequest", async (request) => {
    request.undevice = deviceDetector.detect({
      headers: request.headers,
    });
  });

  service.register(rootRouter);

  service.register(hexRouter, { prefix: ROUTES.hex });
  service.register(base64Router, { prefix: ROUTES.base64 });
  service.register(base64urlRouter, { prefix: ROUTES.base64url });
  service.register(nanoidRouter, { prefix: ROUTES.nanoid });
  service.register(uuidRouter);
  service.register(uuidv7Router);
});

app.setNotFoundHandler(async (request, reply) => {
  const path = request.url.split("?")[0];

  return sendError(reply, 404, `Cannot ${request.method} ${path}`);
});
