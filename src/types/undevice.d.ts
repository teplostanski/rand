import type { deviceDetector } from "../app.js";

type DeviceInfo = ReturnType<typeof deviceDetector.detect>;

declare module "fastify" {
  interface FastifyRequest {
    undevice: DeviceInfo;
  }
}
