import { Router } from "express";
import { FORMATS, type Generator, ROUTES } from "../constants.js";
import { responseFormat } from "../middleware/response-format.js";
import {
  type LengthOptions,
  validateLength,
} from "../middleware/validate-length.js";

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

      if (res.locals.format === FORMATS.json) {
        res.json({ [responseKey]: value });
        return;
      }

      res.type("text/plain").send(value);
    },
  );

  return router;
};
