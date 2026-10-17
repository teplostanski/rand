import { ENCODINGS } from "../constants.js";
import { createRandomRouter } from "./create-random-router.js";

export const base64urlRouter = createRandomRouter(ENCODINGS.base64url);
