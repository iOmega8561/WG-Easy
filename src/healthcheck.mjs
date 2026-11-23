/* eslint-disable no-undef */

'use strict';

// Health check for the container: exits 0 when the web interface answers /healthz.
// Runs with node alone, so it works in the distroless image, which has no shell or curl.

const port = Number(process.env.PORT || '3000');
const host = process.env.WEBUI_HOST;
const target = !host || host === '0.0.0.0' || host === '::' ? '127.0.0.1' : host;

try {
  const response = await fetch(`http://${target.includes(':') ? `[${target}]` : target}:${port}/healthz`, {
    signal: AbortSignal.timeout(3000),
  });
  process.exit(response.ok ? 0 : 1);
} catch {
  process.exit(1);
}
