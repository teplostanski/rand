import type { FastifyPluginAsync } from "fastify";
import { INFO, ROUTES } from "../constants.js";
import { formatServiceHtml } from "../utils/format-service-html.js";
import { formatServiceInfo } from "../utils/format-service-info.js";

export const rootRouter: FastifyPluginAsync = async (app) => {
  app.get(ROUTES.root, async (request, reply) => {
    reply.header("Vary", "User-Agent");

    if (request.undevice.isCrawler) {
      return reply
        .type("text/html; charset=utf-8")
        .send(formatServiceHtml(INFO));
    }

    return reply
      .type("text/plain; charset=utf-8")
      .send(formatServiceInfo(INFO, request.undevice.isRawClient));
  });
};
