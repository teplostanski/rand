import { randomUUID } from "node:crypto";
import { ROUTES } from "../constants.js";
import { createUUIDRouter } from "./create-uuid-router.js";

export const uuidRouter = createUUIDRouter(ROUTES.uuid, "uuid", randomUUID);
