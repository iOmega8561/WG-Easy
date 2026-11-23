import { defineConfig } from 'tsup';

/**
 * The server, the password tool and the health check, each bundled with every dependency
 * it uses. The container then needs dist/ and a Node runtime, nothing else: no
 * node_modules, no npm, no package manager at all.
 */
export default defineConfig({
  entry: {
    main: './lib/main.ts',
    wgpw: './wgpw.mjs',
    healthcheck: './healthcheck.mjs',
  },
  outDir: './dist/lib',
  format: 'esm',
  target: 'node20',
  platform: 'node',
  clean: true,
  noExternal: [/.*/],
  // Some bundled dependencies are CommonJS and call require() for Node built-ins.
  banner: {
    js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
  },
});
