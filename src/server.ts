import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  app.log.info({ signal }, "Shutting down");

  const timeout = setTimeout(() => {
    app.log.error("Shutdown timed out");
    process.exit(1);
  }, 10_000);
  timeout.unref();

  try {
    await app.close();
  } catch (error) {
    app.log.error(error, "Shutdown failed");
    process.exitCode = 1;
  } finally {
    clearTimeout(timeout);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error, "Server failed to start");
  process.exitCode = 1;
  await shutdown("startup failure");
}
