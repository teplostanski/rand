import packageInfo from "../package.json" with { type: "json" };

export const DEFAULT_BYTE_LENGTH = 16;
export const MAX_BYTE_LENGTH = 1_000;

export const ROUTES = {
  root: "/",
  health: "/health",
  hex: "/hex",
  base64: "/base64",
  optionalByteLength: "{/:byteLength}",
} as const;

export const FORMATS = {
  plainText: "text",
  json: "json",
} as const;

export const ENCODINGS = {
  hex: "hex",
  base64: "base64",
} as const;

export const INFO = {
  name: packageInfo.name,
  description: packageInfo.description,
  version: packageInfo.version,
  usage: {
    endpoint: "GET /{encoding}/{byteLength}",
    encodings: Object.values(ENCODINGS),
    byteLength: `Optional. 1–${MAX_BYTE_LENGTH} bytes before encoding; default: ${DEFAULT_BYTE_LENGTH}.`,
    responseFormat: "?format=text (default) or ?format=json.",
    examples: ["/hex", "/hex/32?format=json", "/base64/16"],
    response:
      'Plain text or a JSON object keyed by encoding, e.g. {"hex":"a3f1"}.',
    errors: "400 for invalid length or format; errors are plain text.",
  },
  docsUrl: "https://github.com/teplostanski/rand#readme",
} as const;
