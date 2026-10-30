import type { INFO } from "../constants.js";
import { formatServiceInfo } from "./format-service-info.js";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const formatServiceHtml = (info: typeof INFO): string => {
  const title = escapeHtml(`${info.name}: Randomness. On demand.`);
  const description = escapeHtml(info.description);
  const url = escapeHtml(new URL("/", info.baseUrl).href);
  const image = escapeHtml(new URL("/og-image.png", info.baseUrl).href);
  const imageAlt = "rand.hacks.run: Randomness. On demand.";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="/favicon.ico">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="${escapeHtml(info.name)}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${imageAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${imageAlt}">
  <meta name="theme-color" content="#000000">
</head>
<body>
  <main>
    <h1>${escapeHtml(info.name)}</h1>
    <pre>${escapeHtml(formatServiceInfo(info, false))}</pre>
    <a href="${escapeHtml(info.githubUrl)}">GitHub</a>
  </main>
</body>
</html>`;
};
