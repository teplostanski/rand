import type { UUID } from "node:crypto";
import { Router } from "express";
import { IDS } from "../constants.js";
import { responseFormat } from "../middleware/response-format.js";
import { send } from "../utils/send.js";
import { sendError } from "../utils/send-error.js";

type UUIDResponseKey = Exclude<(typeof IDS)[keyof typeof IDS], "nanoid">;
type UUIDPath = `/${UUIDResponseKey}`;

export const createUUIDRouter = (
  route: UUIDPath,
  key: UUIDResponseKey,
  generate: () => UUID,
) => {
  const router = Router();

  router.get(route, responseFormat, (_req, res) => {
    const uuid = generate();

    send(res, { [key]: uuid }, uuid);
  });

  router.get(`${route}/*params`, (_req, res) => {
    sendError(
      res,
      400,
      `Path parameters, including length, are not supported for ${route}. Use ${route} without path parameters.`,
    );
  });

  return router;
};
