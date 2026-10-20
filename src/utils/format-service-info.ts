import type { INFO } from "../constants.js";

export const formatServiceInfo = (info: typeof INFO): string => {
  const buildDetails = [info.build.commit?.slice(0, 7), info.build.date].filter(
    Boolean,
  );
  const buildLine = buildDetails.length
    ? `\nBuild: ${buildDetails.join(" · ")}\n`
    : "";

  return `${info.name} API v${info.apiVersion}
${info.description}

Usage:
  ${info.usage.endpoints.join("\n  ")}

Encodings:
  ${info.usage.encodings.join(", ")}

IDs:
  ${info.usage.ids.join(", ")}

Parameters:
  byteLength  ${info.usage.byteLength}
  length      ${info.usage.length}
  format      ${info.usage.responseFormat}

Examples:
${info.usage.examples.map((example) => `  ${example}`).join("\n")}

Errors:
  ${info.usage.errors}

Github:
  ${info.githubUrl}

${buildLine}`;
};
