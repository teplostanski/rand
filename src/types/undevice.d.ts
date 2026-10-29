import type { UndeviceMiddlewareFlags } from "undevice/express";
import type { undeviceMiddleware } from "../app.js";

type Flags = UndeviceMiddlewareFlags<typeof undeviceMiddleware>;

declare module "undevice/express" {
  interface UndeviceCustomFlags extends Flags {}
}
