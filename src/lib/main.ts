'use strict';

import WireGuard from './service/WireGuard';
import Server from './service/Server';

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
