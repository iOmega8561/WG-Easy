'use strict';

import WireGuard from './service/WireGuard';
import Server from './service/Server';
import env from './config/env';
import { isInPath } from './service/Utility';

// Managing the interface needs wg and wg-quick. Fail now, with a reason, rather than at the
// first wg-quick call. (Off Linux, commands are skipped altogether, as in development.)
if (env.WG_MANAGED && process.platform === 'linux') {
  const missing = ['wg', 'wg-quick'].filter((tool) => !isInPath(tool));
  if (missing.length > 0) {
    console.error(
      `WG_MANAGED is set, but ${missing.join(' and ')} can't be found. ` +
      'Use the managed image (Containerfile.managed), or unset WG_MANAGED to only write the configuration.'
    );
    process.exit(1);
  }
}

const wgService = new WireGuard();
new Server(wgService);

wgService.getConfig()
  .catch((err) => {
    console.error(err);

    process.exit(1);
  });

async function shutdown() {
  await wgService.Shutdown();
  process.exit(0);
}

// Handle terminate signal
process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM signal received.');
  await shutdown();
});

// Handle interrupt signal
process.on('SIGINT', async () => {
  // eslint-disable-next-line no-console
  console.log('SIGINT signal received.');
  await shutdown();
});
