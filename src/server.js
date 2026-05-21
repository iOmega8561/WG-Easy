/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */

'use strict';

const WireGuard = require('./lib/WireGuard');
const Server = require('./lib/Server');

const wgService = new WireGuard();
new Server(wgService);

wgService.getConfig()
  .catch((err) => {
    console.error(err);

    process.exit(1);
  });

// Handle terminate signal
process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM signal received.');
  
  await wgService.Shutdown();

  process.exit(0);
});

// Handle interrupt signal
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('SIGINT signal received.');
});
