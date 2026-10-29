import { styleText } from "node:util";
import {
  DEFAULT_BYTE_LENGTH,
  DEFAULT_ID_LENGTH,
  type INFO,
  MAX_BYTE_LENGTH,
  MAX_ID_LENGTH,
  NEW_LINE,
} from "../constants.js";

export const formatServiceInfo = (
  info: typeof INFO,
  isTerminal: boolean,
): string => {
  const color = (name: "blue" | "green" | "yellow", text: string) =>
    isTerminal ? styleText(name, text, { validateStream: false }) : text;
  const blue = (text: string) => color("blue", text);
  const green = (text: string) => color("green", text);
  const yellow = (text: string) => color("yellow", text);
  const metadata = [
    `api ${blue(`v${info.apiVersion}`)}`,
    info.build.commit
      ? `build ${blue(info.build.commit.slice(0, 7))}`
      : undefined,
    info.build.date ? `update ${blue(info.build.date)}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
  return `${info.name}
${metadata}

${info.description}

${blue("USAGE:")}
  Base URL: ${info.baseUrl}

  ${green("GET")} /${green("{")}encoding${green("}")}/${green("{")}byteLength${green("}")}
  ${green("GET")} /nanoid/${green("{")}length${green("}")}

${blue("ENCODINGS:")}
  ${info.usage.encodings.join(", ")}

${blue("IDS:")}
  ${info.usage.ids.join(", ")}

${blue("PARAMETERS:")}
  byteLength  ${yellow(`1–${MAX_BYTE_LENGTH}`)} bytes
              default: ${yellow(String(DEFAULT_BYTE_LENGTH))}

  length      ${yellow(`1–${MAX_ID_LENGTH}`)} chars
              default: ${yellow(String(DEFAULT_ID_LENGTH))}

Both parameters are optional.
Shorter Nano IDs have a higher collision probability.

${blue("RESPONSE FORMAT:")}
  ${info.usage.responseFormat.replace(/\?(?:json|pretty)/g, (match) => yellow(match))}

${blue("EXAMPLES:")}
${info.usage.examples.map((example) => `  ${example}`).join("\n")}

${blue("ERRORS:")}
  ${info.usage.errors}

${blue("GITHUB:")}
  ${info.githubUrl}
${NEW_LINE}
`;
};
