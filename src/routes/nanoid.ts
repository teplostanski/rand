import { nanoid } from "nanoid";
import { DEFAULT_ID_LENGTH, IDS, MAX_ID_LENGTH } from "../constants.js";
import { createRandomRouter } from "./create-random-router.js";

export const nanoidRouter = createRandomRouter({
  responseKey: IDS.nanoid,
  length: {
    param: "length",
    defaultValue: DEFAULT_ID_LENGTH,
    max: MAX_ID_LENGTH,
  },
  generate: (length) => nanoid(length),
});
