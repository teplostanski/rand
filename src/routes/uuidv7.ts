import { randomUUIDv7 } from "node:crypto";
import { ROUTES } from "../constants.js";
import { createUUIDRouter } from "./create-uuid-router.js";

export const uuidv7Router = createUUIDRouter(
  ROUTES.uuidv7,
  "uuidv7",
  randomUUIDv7,
);
