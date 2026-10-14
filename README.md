# rand

[![Service status][service-status-badge]][service-url]

A small service for generating cryptographically secure random data through a simple API.

[rand.hacks.run](https://rand.hacks.run)

## Run locally

Requires Node.js 24+ and pnpm.

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
```

| Parameter | Values | Default |
| --- | --- | --- |
| `encoding` | `hex`, `base64` | Required |
| `byteLength` | Integer from 1 to 1000; optional | `16` |
| `format` (query) | `text`, `json` | `text` |

`byteLength` is the number of random bytes **before encoding**, not the length of the resulting string. For example, 16 bytes produce 32 hex characters or 24 base64 characters, including padding.

### curl

```sh
# 16 random bytes as hex (plain text)
curl 'https://rand.hacks.run/hex'

# 32 random bytes as base64 (JSON)
curl 'https://rand.hacks.run/base64/32?format=json'
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
const response = await fetch('https://rand.hacks.run/base64/32?format=json');
if (!response.ok) throw new Error(await response.text());

const { base64 } = await response.json();
console.log(base64);
```

JSON responses use the encoding as the key: `hex` or `base64`. Text responses contain only the encoded value and use `Content-Type: text/plain`.

### Service information

`GET /` returns the service description and usage guide as plain text.

### Errors

Invalid lengths and unsupported response formats return `400`. Unmatched routes return `404`. These responses use plain text, including when `format=json` is requested. Check `response.ok` before parsing JSON, as shown above.

## License

[MIT](./LICENSE) License © 2026-present [Teplostanski Igor](https://github.com/teplostanski)

[service-status-badge]: https://img.shields.io/website?url=https%3A%2F%2Frand.hacks.run%2Fhealth&label=service&up_message=online&down_message=offline
[service-url]: https://rand.hacks.run
