'use strict';

import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

import debug from 'debug';

import {
  App,
  createApp,
  createError,
  createRouter,
  defineEventHandler,
  getRouterParam,
  toNodeListener,
  readBody,
  setHeader,
  serveStatic,
  getRequestHeader,
} from 'h3';

import WireGuard from './WireGuard';
import env from '../config/env';
import { isPasswordValid } from './Utility';
import { getAppSession } from '../config/session';

const requiresPassword = !!env.PASSWORD_HASH;

class Server {

  app: App;

  constructor(wgService: WireGuard) {
    const app = createApp();
    this.app = app;

    const router = createRouter();
    app.use(router);

    router
      .get('/api/release', defineEventHandler((event) => {
        setHeader(event, 'Content-Type', 'application/json');
        return env.RELEASE;
      }))
      // Authentication - GET
      .get('/api/session', defineEventHandler(async (event) => {
        let authenticated = true;
    
        if (requiresPassword) {
          const session = await getAppSession(event);
          authenticated = !!session.data?.authenticated;
        }
    
        return {
          requiresPassword,
          authenticated,
        };
      }))
      .post('/api/session', defineEventHandler(async (event) => {
        const { password } = await readBody(event);

        if (!requiresPassword) {
          // if no password is required, the API should never be called.
          // Do not automatically authenticate the user.
          throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Invalid state',
          });
        }

        if (!isPasswordValid(password, env.PASSWORD_HASH)) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Incorrect Password',
          });
        }

        const session = await getAppSession(event);
        await session.update({
          authenticated: true
        });

        debug(`New Session: ${session.id}`);

        return { success: true };
      }));

    // WireGuard
    app.use(defineEventHandler(async (event) => {
        if (!requiresPassword || !event.path.startsWith('/api/')) {
          return;
        }

        const session = await getAppSession(event);
        if (session.data && session.data.authenticated) {
          return;
        }
    
        const authHeader = getRequestHeader(event, 'authorization');
        
        if (event.path.startsWith('/api/') && authHeader) {
          if (isPasswordValid(authHeader, env.PASSWORD_HASH)) {
            await session.update({ authenticated: true });
            return;
          }

          throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            data: { error: 'Incorrect Password' }
          });
        }

        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
          data: { error: 'Not Logged In' }
        });
      }),
    );

    const router2 = createRouter();
    app.use(router2);

    router2
      .delete('/api/session', defineEventHandler(async (event) => {
        const session = await getAppSession(event);
        const sessionId = session.id;
    
        await session.clear();
    
        debug(`Deleted Session: ${sessionId}`);
        return { success: true };
      }))
      .get('/api/wireguard/client', defineEventHandler(() => {
        return wgService.getClients();
      }))
      .get('/api/wireguard/client/:clientId/qrcode.svg', defineEventHandler(async (event) => {
        const clientId = getRouterParam(event, 'clientId');
        if (!clientId) throw createError({ status: 400 });

        const svg = await wgService.getClientQRCodeSVG({ clientId });
        setHeader(event, 'Content-Type', 'image/svg+xml');
        return svg;
      }))
      .get('/api/wireguard/client/:clientId/configuration', defineEventHandler(async (event) => {
        const clientId = getRouterParam(event, 'clientId');
        if (!clientId) throw createError({ status: 400 });

        const client = await wgService.getClient({ clientId });
        if (!client) throw createError({ status: 404 });

        const config = await wgService.getClientConfiguration({ clientId });
        const configName = client.name
          .replace(/[^a-zA-Z0-9_=+.-]/g, '-')
          .replace(/(-{2,}|-$)/g, '-')
          .replace(/-$/, '')
          .substring(0, 32);
        setHeader(event, 'Content-Disposition', `attachment; filename="${configName || clientId}.conf"`);
        setHeader(event, 'Content-Type', 'text/plain');
        return config;
      }))
      .post('/api/wireguard/client', defineEventHandler(async (event) => {
        const { name } = await readBody(event);
        await wgService.createClient({ name });
        return { success: true };
      }))
      .delete('/api/wireguard/client/:clientId', defineEventHandler(async (event) => {
        const clientId = getRouterParam(event, 'clientId');
        if (!clientId) throw createError({ status: 400 });
        await wgService.deleteClient({ clientId });
        return { success: true };
      }))
      .post('/api/wireguard/client/:clientId/enable', defineEventHandler(async (event) => {
        const clientId = getRouterParam(event, 'clientId');
        if (clientId === '__proto__' || clientId === 'constructor' || clientId === 'prototype') {
          throw createError({ status: 403 });
        }
        if (!clientId) throw createError({ status: 400 });
        await wgService.enableClient({ clientId });
        return { success: true };
      }))
      .post('/api/wireguard/client/:clientId/disable', defineEventHandler(async (event) => {
        const clientId = getRouterParam(event, 'clientId');
        if (clientId === '__proto__' || clientId === 'constructor' || clientId === 'prototype') {
          throw createError({ status: 403 });
        }
        if (!clientId) throw createError({ status: 400 });
        await wgService.disableClient({ clientId });
        return { success: true };
      }))
      .put('/api/wireguard/client/:clientId/name', defineEventHandler(async (event) => {
        const clientId = getRouterParam(event, 'clientId');
        if (clientId === '__proto__' || clientId === 'constructor' || clientId === 'prototype') {
          throw createError({ status: 403 });
        }
        if (!clientId) throw createError({ status: 400 });
        const { name } = await readBody(event);
        await wgService.updateClientName({ clientId, name });
        return { success: true };
      }))
      .put('/api/wireguard/client/:clientId/address', defineEventHandler(async (event) => {
        const clientId = getRouterParam(event, 'clientId');
        if (clientId === '__proto__' || clientId === 'constructor' || clientId === 'prototype') {
          throw createError({ status: 403 });
        }
        if (!clientId) throw createError({ status: 400 });
        const { address } = await readBody(event);
        await wgService.updateClientAddress({ clientId, address });
        return { success: true };
      }));

    const safePathJoin = (base: string, target: string) => {
      // Manage web root (edge case)
      if (target === '/') {
        return `${base}${sep}`;
      }

      // Prepend './' to prevent absolute paths
      const targetPath = `.${sep}${target}`;

      // Resolve the absolute path
      const resolvedPath = resolve(base, targetPath);

      // Check if resolvedPath is a subpath of base
      if (resolvedPath.startsWith(`${base}${sep}`)) {
        return resolvedPath;
      }

      throw createError({
        status: 400,
        message: 'Bad Request',
      });
    };

    // backup_restore
    const router3 = createRouter();
    app.use(router3);

    router3
      .get('/api/wireguard/backup', defineEventHandler(async (event) => {
        const config = await wgService.backupConfiguration();
        setHeader(event, 'Content-Disposition', 'attachment; filename="wg0.json"');
        setHeader(event, 'Content-Type', 'text/json');
        return config;
      }))
      .put('/api/wireguard/restore', defineEventHandler(async (event) => {
        const { file } = await readBody(event);
        await wgService.restoreConfiguration(file);
        return { success: true };
      }));

    const publicDir = resolve(import.meta.dirname, '../www');
    app.use(
      defineEventHandler((event) => {
        return serveStatic(event, {
          getContents: (id) => {
            return readFile(safePathJoin(publicDir, id));
          },
          getMeta: async (id) => {
            const filePath = safePathJoin(publicDir, id);

            const stats = await stat(filePath).catch(() => {});
            if (!stats || !stats.isFile()) {
              return;
            }

            if (id.endsWith('.html')) setHeader(event, 'Content-Type', 'text/html');
            if (id.endsWith('.js')) setHeader(event, 'Content-Type', 'application/javascript');
            if (id.endsWith('.json')) setHeader(event, 'Content-Type', 'application/json');
            if (id.endsWith('.css')) setHeader(event, 'Content-Type', 'text/css');
            if (id.endsWith('.png')) setHeader(event, 'Content-Type', 'image/png');

            return {
              size: stats.size,
              mtime: stats.mtimeMs,
            };
          },
        });
      }),
    );

    createServer(toNodeListener(app)).listen(env.PORT, env.WEBUI_HOST);
    debug(`Listening on http://${env.WEBUI_HOST}:${env.PORT}`);
  }

};

export default Server;