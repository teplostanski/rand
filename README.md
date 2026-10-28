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
GET /nanoid/{length}
```

| Parameter | Values | Default |
| --- | --- | --- |
| `encoding` | `hex`, `base64`, `base64url` | Required for encoded bytes |
| `byteLength` | Integer from 1 to 1000 bytes; optional for encodings | `16` |
| `length` | Integer from 1 to 1000 characters; optional for Nano ID | `21` |

`byteLength` is the number of random bytes **before encoding**, not the length of the resulting string. For example, 16 bytes produce 32 hex characters or 24 base64 characters, including padding.

Encoded bytes are available through `/hex`, `/base64`, and `/base64url`. Identifiers are available through `/nanoid`; its `length` counts output characters and defaults to 21. Shorter IDs have a higher collision probability. UUID support is planned and is not currently available.

### Response format

Responses are plain text by default. Add `?json` for compact JSON or `?pretty` for JSON with two-space indentation. If both flags are present (`?json&pretty`), `pretty` takes precedence. Only presence matters: `?json`, `?json=`, and `?json=false` all request JSON. Unknown query parameters are ignored.

These flags apply to generator endpoints. `/` always returns plain text, and `/health` always returns JSON.

### curl

```sh
# 16 random bytes as hex (plain text)
curl 'https://rand.hacks.run/hex'

# 32 random bytes as base64 (JSON)
curl 'https://rand.hacks.run/base64/32?json'

# Nano ID with 21 characters (JSON)
curl 'https://rand.hacks.run/nanoid/21?json'

# 16 random bytes as hex (indented JSON)
curl 'https://rand.hacks.run/hex?pretty'
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

JSON responses use the generator name as the key: `hex`, `base64`, `base64url`, or `nanoid`. For example, `/nanoid?json` returns `{"nanoid":"..."}`. Both JSON formats use `Content-Type: application/json`. Text responses contain only the generated value and use `Content-Type: text/plain`.

### Service information

`GET /` returns the service description and usage guide as plain text.

### Errors

Invalid lengths return `400`. Unmatched routes return `404`. These responses use plain text, including when `?json` or `?pretty` is requested. Check `response.ok` before parsing JSON, as shown above.

## Self-hosting: deploy your fork on a VPS

The GitHub Actions workflow checks the project, publishes an image to GHCR, and deploys it over SSH. The VPS needs Docker with Compose, Caddy running as a system service, and a deployment user who can run Docker without `sudo`. The published image targets `linux/amd64`.

Fork this repository and enable GitHub Actions in your fork. In the examples below, replace:

- `rand.example.com` with a domain you control, pointing to your VPS.
- `YOUR_OWNER/YOUR_REPO` with your fork's GitHub owner and repository name, both lowercase. The workflow derives the GHCR image name from your fork automatically.
- `deploy` with your VPS deployment user, and `/home/deploy/apps/rand` with that user's actual absolute deployment path.

### 1. Prepare the VPS

Run as the deployment user:

```sh
mkdir -p ~/apps/rand
cd ~/apps/rand
docker compose version
docker network inspect rand_default >/dev/null 2>&1 || docker network create rand_default
docker network inspect rand_default --format '{{range .IPAM.Config}}{{.Gateway}}{{end}}'
```

Create `~/apps/rand/.env`:

```dotenv
HOST_PORT=3001
APP_IMAGE=ghcr.io/YOUR_OWNER/YOUR_REPO:latest
TRUST_PROXY=<gateway returned above>
```

Replace the image placeholders as described above and set `TRUST_PROXY` to the actual gateway address. For Caddy running on the host and proxying through the published Docker port, this is the trusted proxy address used by this setup. Do not use the VPS public IP or trust every address.

Choose a free `HOST_PORT`; the application still listens on port `3000` inside the container. Check port availability with `sudo ss -ltnp`. The workflow updates `APP_IMAGE` to the deployed commit's image tag after a successful deployment.

Once the image is published, verify registry access as the deployment user:

```sh
docker pull 'ghcr.io/YOUR_OWNER/YOUR_REPO:latest'
```

For a private image, authenticate this user to GHCR with package read access first. There is no need to clone the repository on the VPS: the workflow uploads the Compose configuration.

### 2. Configure Caddy on the VPS

Point `rand.example.com` to the VPS and allow inbound HTTP and HTTPS traffic. Create `/etc/caddy/sites-enabled/rand.caddy`:

```caddyfile
rand.example.com {
    reverse_proxy 127.0.0.1:3001
}
```

The upstream port must match `HOST_PORT`. Ensure `/etc/caddy/Caddyfile` includes the following line outside any site block, preserving existing configuration:

```caddyfile
import /etc/caddy/sites-enabled/*.caddy
```

Validate the configuration, then reload only if validation succeeds:

```sh
sudo caddy validate --config /etc/caddy/Caddyfile && sudo systemctl reload caddy
```

A `502` response is expected until the application is running.

### 3. Configure GitHub Secrets

In your fork, open **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
| --- | --- |
| `VPS_HOST` | VPS IP address or SSH hostname |
| `VPS_PORT` | SSH port, e.g. `10022` |
| `VPS_USER` | Deployment user, e.g. `deploy` |
| `VPS_DEPLOY_PATH` | Absolute deployment directory, e.g. `/home/deploy/apps/rand`; do not use `~` |
| `VPS_SSH_KEY` | Complete private deployment key, including its header and footer; no passphrase |
| `VPS_KNOWN_HOSTS` | Verified SSH host-key record for the configured host and port |

The deployment key's public half must be in the user's `~/.ssh/authorized_keys`. An existing deployment key can be reused. `VPS_SSH_KEY` is not the public key or the server host key.

To prepare `VPS_KNOWN_HOSTS`, run this from an already trusted SSH session on the VPS. Replace `YOUR_VPS_HOST` with the exact value of `VPS_HOST` and adjust the port:

```sh
sudo awk '{print "[YOUR_VPS_HOST]:10022 " $1 " " $2}' /etc/ssh/ssh_host_ed25519_key.pub
```

Copy the complete output into the secret. For the default SSH port `22`, use `YOUR_VPS_HOST` without brackets or a port suffix. Verify changed host keys before updating this secret.

`GITHUB_TOKEN` is provided automatically for image publishing. The `.env` settings belong on the VPS, not in GitHub Secrets.

### 4. Deploy from GitHub

The repository's `compose.production.yaml` uses the project name `rand`, external network `rand_default`, and host port from `HOST_PORT`. The workflow also uses `-p rand` to keep this deployment separate from other projects.

Push configuration changes to `main`, or select **Actions → CI → Run workflow → main**. The workflow uploads `compose.production.yaml`, installs it as `~/apps/rand/compose.yaml`, pulls the published image, and waits for the container to become healthy.

## Troubleshooting

Run on the VPS from the deployment directory. Replace `rand.example.com` with your domain and `3001` if you chose another `HOST_PORT`:

```sh
cd ~/apps/rand
docker compose ps
docker compose logs --tail=50 app
curl -i http://127.0.0.1:3001/health
curl -i https://rand.example.com/health
sudo journalctl -u caddy -n 50 --no-pager
```

If the first deployment failed before installing `compose.yaml`, check the failed workflow step first; the Compose diagnostics above require that file.

| Problem | Check |
| --- | --- |
| Missing `APP_IMAGE` or `TRUST_PROXY` | Set both in the deployment directory's `.env`. During deployment, the workflow supplies `APP_IMAGE` and saves it after success. |
| External network not found | Create `rand_default` on the VPS and use its actual gateway for `TRUST_PROXY`. |
| Port already allocated | Choose a free `HOST_PORT` and update the Caddy upstream to match. |
| SSH authentication fails | Check the user, port, private key, and `authorized_keys`. The workflow requires a key without a passphrase. |
| Host-key verification fails | Check `VPS_KNOWN_HOSTS` against the configured host and port. Verify any changed fingerprint before replacing the record. |
| Image pull denied | Check GHCR visibility or log in as the deployment user with package read access. |
| Docker permission denied | The SSH user must be able to run Docker without `sudo`. |
| HTTPS returns `502` | Check container health, `HOST_PORT`, the Caddy upstream, and both services' logs. |
| Client IP is incorrect | Check `TRUST_PROXY` against the proxy address visible to the container (the Docker network gateway in this setup), then recreate the container after changing `.env`. |
| SSH connection times out | Check the address, port, firewall, and access from GitHub-hosted runners. |

After correcting GitHub Secrets or VPS settings, use **Re-run failed jobs** in GitHub Actions. After changing repository files, push a new commit and use its workflow run: rerunning an old run uses the old configuration.

## License

[MIT](./LICENSE) License © 2026-present [Teplostanski Igor](https://github.com/teplostanski)

[service-status-badge]: https://img.shields.io/website?url=https%3A%2F%2Frand.hacks.run%2Fhealth&label=service&up_message=online&down_message=offline
[service-url]: https://rand.hacks.run
