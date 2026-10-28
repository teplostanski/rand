import type { INFO } from "../constants.js";

export const formatServiceInfo = (info: typeof INFO): string => {
  const buildDetails = [info.build.commit?.slice(0, 7), info.build.date].filter(
    Boolean,
  );
  const buildLine = buildDetails.length
    ? `\nBUILD: ${buildDetails.join(" · ")}\n`
    : "";

  return `${info.name} API v${info.apiVersion}
${info.description}

USAGE:
  ${info.usage.endpoints.join("\n  ")}

ENCODINGS:
  ${info.usage.encodings.join(", ")}

IDS:
  ${info.usage.ids.join(", ")}

PARAMETERS:
  byteLength  ${info.usage.byteLength}
  length      ${info.usage.length}

RESPONSE FORMAT:
  ${info.usage.responseFormat}

EXAMPLES:
${info.usage.examples.map((example) => `  ${example}`).join("\n")}

ERRORS:
  ${info.usage.errors}

GITHUB:
  ${info.githubUrl}
${buildLine}`;
};
