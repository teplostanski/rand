import type { FastifyPluginAsync } from "fastify";
import { type Generator, ROUTES } from "../constants.js";
import { responseFormat } from "../utils/response-format.js";
import { send } from "../utils/send.js";
import { sendError } from "../utils/send-error.js";
import {
  type LengthOptions,
  validateLength,
} from "../utils/validate-length.js";

type RandomRouterOptions = {
  responseKey: Generator;
  length: LengthOptions;
  generate: (length: number) => string;
};

type RandomRequest = {
  Params: Partial<Record<LengthOptions["param"], string>>;
  Querystring: Record<string, unknown>;
};

export const createRandomRouter = ({
  responseKey,
  length,
  generate,
}: RandomRouterOptions): FastifyPluginAsync => {
  return async (app) => {
    app.get<RandomRequest>(
      ROUTES.optionalParam(length.param),
      async (request, reply) => {
        const size = validateLength(request.params[length.param], length);

        if (size === undefined) {
          return sendError(reply, 400, "Invalid length");
        }

        const value = generate(size);

        return send(
          reply,
          responseFormat(request.query),
          { [responseKey]: value },
          value,
        );
      },
    );
  };
};
