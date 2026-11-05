import type { UUID } from "node:crypto";
import type { FastifyPluginAsync } from "fastify";
import type { IDS } from "../constants.js";
import { responseFormat } from "../utils/response-format.js";
import { send } from "../utils/send.js";
import { sendError } from "../utils/send-error.js";

type UUIDResponseKey = Exclude<(typeof IDS)[keyof typeof IDS], "nanoid">;
type UUIDPath = `/${UUIDResponseKey}`;

export const createUUIDRouter = (
  route: UUIDPath,
  key: UUIDResponseKey,
  generate: () => UUID,
): FastifyPluginAsync => {
  return async (app) => {
    app.get<{ Querystring: Record<string, unknown> }>(
      route,
      async (request, reply) => {
        const uuid = generate();

        return send(
          reply,
          responseFormat(request.query),
          { [key]: uuid },
          uuid,
        );
      },
    );

    app.get(`${route}/*`, async (_request, reply) => {
      return sendError(
        reply,
        400,
        `Path parameters, including length, are not supported for ${route}. Use ${route} without path parameters.`,
      );
    });
  };
};
