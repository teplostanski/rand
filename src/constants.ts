import packageInfo from "../package.json" with { type: "json" };

export const DEFAULT_BYTE_LENGTH = 16;
export const MAX_BYTE_LENGTH = 1_000;
export const DEFAULT_ID_LENGTH = 21;
export const MAX_ID_LENGTH = 1_000;

const API_VERSION = "1.2";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

export const ROUTES = {
  root: "/",
  health: "/health",
  hex: "/hex",
  base64: "/base64",
  base64url: "/base64url",
  nanoid: "/nanoid",
  optionalParam: (param: string) => `{/:${param}}`,
} as const;

export const FORMATS = {
  plainText: "text",
  json: "json",
} as const;

export const ENCODINGS = {
  hex: "hex",
  base64: "base64",
  base64url: "base64url",
} as const;

export const IDS = {
  nanoid: "nanoid",
} as const;

export type Generator =
  | (typeof ENCODINGS)[keyof typeof ENCODINGS]
  | (typeof IDS)[keyof typeof IDS];

export const INFO = {
  name: packageInfo.name,
  description: packageInfo.description,
  apiVersion: API_VERSION,
  usage: {
    endpoints: ["GET /{encoding}/{byteLength}", "GET /nanoid/{length}"],
    encodings: Object.values(ENCODINGS),
    ids: Object.values(IDS),
    byteLength: `Optional. 1–${MAX_BYTE_LENGTH} bytes before encoding; default: ${DEFAULT_BYTE_LENGTH}.`,
    length: `Optional for Nano ID. 1–${MAX_ID_LENGTH} characters; default: ${DEFAULT_ID_LENGTH}. Shorter IDs have a higher collision probability.`,
    responseFormat: "?format=text (default) or ?format=json.",
    examples: [
      "/hex",
      "/hex/32?format=json",
      "/base64url/16",
      "/nanoid",
      "/nanoid/21?format=json",
    ],
    response:
      'Plain text or a JSON object keyed by generator, e.g. {"hex":"a3f1"}.',
    errors: "400 for invalid length or format; errors are plain text.",
  },
  build: {
    commit:
      process.env.BUILD_COMMIT?.trim() ||
      (IS_DEVELOPMENT ? "0000000" : undefined),
    date:
      process.env.BUILD_DATE?.trim() ||
      (IS_DEVELOPMENT ? new Date().toISOString().slice(0, 10) : undefined),
  },
  githubUrl: "https://github.com/teplostanski/rand",
} as const;
