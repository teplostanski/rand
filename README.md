# rand

[![Service status][service-status-badge]][service-url]

A small service for generating cryptographically secure random data through a simple API.

[rand.hacks.run](https://rand.hacks.run)

## Run locally

Requires Node.js 24.16+ (24.x) or 26.1+ and pnpm. UUIDv7 generation uses the built-in `crypto.randomUUIDv7` API.

```sh
pnpm install
pnpm dev
```

The local server listens on port `3000` by default. Optional settings are listed in `.env.example`; copy it to `.env` to customize them.

To build and run:

```sh
pnpm build
pnpm start
```

For monitoring, `GET /health` returns `{"status":"ok"}`.

## Usage

Base URL: `https://rand.hacks.run`.

```text
GET /{encoding}/{byteLength}
GET /nanoid/{nanoidLength}
GET /uuid
GET /uuidv7
```

| Parameter | Values | Default |
| --- | --- | --- |
| `encoding` | `hex`, `base64`, `base64url` | Required for encoded bytes |
| `byteLength` | Integer from 1 to 1000 bytes; optional for encodings | `16` |
| `nanoidLength` | Integer from 1 to 1000 characters; optional for Nano ID | `21` |

`byteLength` is the number of random bytes **before encoding**, not the length of the resulting string. For example, 16 bytes produce 32 hex characters or 24 base64 characters, including padding.

Encoded bytes are available through `/hex`, `/base64`, and `/base64url`. Identifiers are available through `/nanoid`; its `nanoidLength` counts output characters and defaults to 21. Shorter IDs have a higher collision probability.

`/uuid` generates a random UUIDv4. `/uuidv7` generates a UUIDv7 containing a millisecond Unix timestamp and random bits. UUIDs always contain 36 characters, including hyphens. Neither endpoint accepts path parameters or a custom length. Both support `?json` and `?pretty`.

### Response format

Responses are plain text by default. Add `?json` for compact JSON or `?pretty` for JSON with two-space indentation. If both flags are present (`?json&pretty`), `pretty` takes precedence. Only presence matters: `?json`, `?json=`, and `?json=false` all request JSON. Unknown query parameters are ignored.

These flags apply to generator endpoints. `/` returns HTML with social metadata to recognized crawlers and plain text to other clients, including curl and wget. `/health` always returns JSON.

### curl

16 random bytes as hex (_plain text_)
```bash
curl rand.hacks.run/hex
```

32 random bytes as base64 (_JSON_)
```bash
curl 'rand.hacks.run/base64/32?json'
```

Nano ID with 21 characters (_JSON_)
```bash
curl 'rand.hacks.run/nanoid/21?json'
```

UUIDv4 (_plain text_)
```bash
curl rand.hacks.run/uuid
```

UUIDv7 (_JSON_)
```bash
curl 'rand.hacks.run/uuidv7?json'
```

16 random bytes as hex (_indented JSON_)
```bash
curl 'rand.hacks.run/hex?pretty'
```

### JavaScript

These examples use `fetch` in Node.js with ES modules.

Read a plain text response:

```js
const response = await fetch('https://rand.hacks.run/hex');
if (!response.ok) throw new Error(await response.text());

const hex = await response.text();
console.log(hex);
```

Read a JSON response:

```js
const response = await fetch('https://rand.hacks.run/base64/32?json');
if (!response.ok) throw new Error(await response.text());

const { base64 } = await response.json();
console.log(base64);
```

JSON responses use the generator name as the key: `hex`, `base64`, `base64url`, `nanoid`, `uuid`, or `uuidv7`. For example, `/nanoid?json` returns `{"nanoid":"..."}`. Both JSON formats use `Content-Type: application/json`. Text responses contain only the generated value and use `Content-Type: text/plain`.

### Service information

`GET /` returns the service description and usage guide. The custom `undevice` flag `isCrawler` uses `isbot` to detect crawlers by User-Agent. Crawlers receive the same information in HTML with Open Graph and Twitter Card metadata; other clients receive plain text. curl and wget retain their terminal formatting even when recognized by `isbot`. Responses include `Vary: User-Agent`.

### Errors

Invalid lengths and unsupported UUID path parameters return `400`. For example, `/uuid/8` returns `Path parameters, including length, are not supported for /uuid. Use /uuid without path parameters.` The same rule applies to `/uuidv7/8` and paths with multiple extra segments. Unknown query parameters remain ignored. Unmatched routes return `404`. These responses use plain text, including when `?json` or `?pretty` is requested. Check `response.ok` before parsing JSON, as shown above.

## Deploy with Docker

Run the published image `ghcr.io/teplostanski/rand:latest` (Linux AMD64):

```sh
docker run -d \
  --name rand \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  ghcr.io/teplostanski/rand:latest
```

The service is available at `http://127.0.0.1:3000` on the Docker host:

```sh
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:3000/hex
```

For deployment from your own fork with GitHub Actions and Caddy, see the [self-hosting guide](./SELF_HOSTING.md).

## Social image

The 1200×630 social image is served at `/og-image.png`. Its editable source is
[`assets/og/og-image.html`](./assets/og/og-image.html); capture it at 1200×630 to
update `assets/og/og-image.png`. The root route includes Open Graph and Twitter Card metadata in its HTML response
for crawlers. Generator endpoints continue to serve plain text and JSON.

## License

[MIT](./LICENSE) License © 2026-present [Teplostanski Igor](https://github.com/teplostanski)

[service-status-badge]: https://img.shields.io/website?url=https%3A%2F%2Frand.hacks.run%2Fhealth&label=service&up_message=online&down_message=offline
[service-url]: https://rand.hacks.run
