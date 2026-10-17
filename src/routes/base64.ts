import {
  DEFAULT_BYTE_LENGTH,
  ENCODINGS,
  MAX_BYTE_LENGTH,
} from "../constants.js";
import { generateRandomString } from "../utils/generate-random-string.js";
import { createRandomRouter } from "./create-random-router.js";

export const base64Router = createRandomRouter({
  responseKey: ENCODINGS.base64,
  length: {
    param: "byteLength",
    defaultValue: DEFAULT_BYTE_LENGTH,
    max: MAX_BYTE_LENGTH,
  },
  generate: (bytes) => generateRandomString(bytes, ENCODINGS.base64),
});
