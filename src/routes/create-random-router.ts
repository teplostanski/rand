import { Router } from "express";
import { type Generator, ROUTES } from "../constants.js";
import { responseFormat } from "../middleware/response-format.js";
import {
  type LengthOptions,
  validateLength,
} from "../middleware/validate-length.js";

import { send } from "../utils/send.js";

type RandomRouterOptions = {
  responseKey: Generator;
  length: LengthOptions;
  generate: (length: number) => string;
};

export const createRandomRouter = ({
  responseKey,
  length,
  generate,
}: RandomRouterOptions) => {
  const router = Router();

  router.use(responseFormat);

  router.get(
    ROUTES.optionalParam(length.param),
    validateLength(length),
    (_req, res) => {
      const value = generate(res.locals[length.param]);

      send(res, { [responseKey]: value }, value);
    },
  );

  return router;
};
