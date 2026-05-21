/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */

'use strict';

const Server = require('./lib/Server');
new Server();

const WireGuard = require('./lib/WireGuard').shared;

WireGuard.getConfig()
  .catch((err) => {
    console.error(err);

    process.exit(1);
  });

// Handle terminate signal
process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM signal received.');
  
  await WireGuard.Shutdown();

  process.exit(0);
});

// Handle interrupt signal
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('SIGINT signal received.');
});
