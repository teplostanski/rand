import { Router } from "express";
import { FORMATS, ROUTES } from "../constants.js";
import { responseFormat } from "../middleware/response-format.js";
import { validateByteLength } from "../middleware/validate-byte-length.js";
import {
  type Encoding,
  generateRandomString,
} from "../utils/generate-random-string.js";

export const createRandomRouter = (encoding: Encoding) => {
  const router = Router();

  router.use(responseFormat);

  router.get(ROUTES.optionalByteLength, validateByteLength, (_req, res) => {
    const randomString = generateRandomString(res.locals.byteLength, encoding);

    if (res.locals.format === FORMATS.json) {
      res.json({ [encoding]: randomString });
      return;
    }

    res.type("text/plain").send(randomString);
  });

  return router;
};
