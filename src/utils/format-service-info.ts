import type { INFO } from "../constants.js";

export const formatServiceInfo = (info: typeof INFO): string => {
  return `${info.name} v${info.version}
${info.description}

Usage:
  ${info.usage.endpoint}

Encodings:
  ${info.usage.encodings.join(", ")}

Parameters:
  byteLength  ${info.usage.byteLength}
  format      ${info.usage.responseFormat}

Examples:
${info.usage.examples.map((example) => `  ${example}`).join("\n")}

Errors:
  ${info.usage.errors}

Docs:
  ${info.docsUrl}
`;
};
