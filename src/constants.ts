import packageInfo from "../package.json" with { type: "json" };

export const NEW_LINE = "\n";

export const DEFAULT_BYTE_LENGTH = 16;
export const MAX_BYTE_LENGTH = 1_000;
export const DEFAULT_ID_LENGTH = 21;
export const MAX_ID_LENGTH = 1_000;

const API_VERSION = "1.3";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

export const ROUTES = {
  root: "/",
  health: "/health",
  hex: "/hex",
  base64: "/base64",
  base64url: "/base64url",
  nanoid: "/nanoid",
  uuid: "/uuid",
  uuidv7: "/uuidv7",
  optionalParam: (param: string) => `{/:${param}}`,
} as const;

export const FORMATS = {
  plainText: "text",
  json: "json",
  prettyJson: "pretty",
} as const;

export const ENCODINGS = {
  hex: "hex",
  base64: "base64",
  base64url: "base64url",
} as const;

export const IDS = {
  nanoid: "nanoid",
  uuid: "uuid",
  uuidv7: "uuidv7",
} as const;

export type Generator =
  | (typeof ENCODINGS)[keyof typeof ENCODINGS]
  | (typeof IDS)[keyof typeof IDS];

export const INFO = {
  baseUrl: "https://rand.hacks.run",
  name: packageInfo.name,
  description: packageInfo.description,
  apiVersion: API_VERSION,
  usage: {
    encodings: Object.values(ENCODINGS),
    ids: Object.values(IDS),
    responseFormat:
      "Plain text by default; ?json for compact JSON, ?pretty for JSON with two-space indentation. Flag values are ignored; ?pretty takes precedence. Unknown query parameters are ignored.",
    examples: ["/hex/32", "/nanoid/12?json", "/uuid", "/uuidv7?pretty"],
    errors: [
      {
        status: 400,
        description: "invalid length or unsupported UUID path parameters",
      },
      { status: 404, description: "unmatched routes" },
    ],
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
