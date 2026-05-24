'use strict';

import { version } from '../../package.json';
import Environment from '../types/Environment';

export default {
  RELEASE: version,
  PORT: Number(process.env.PORT || '3000'),
  WEBUI_HOST: process.env.WEBUI_HOST || '0.0.0.0',
  PASSWORD_HASH: process.env.PASSWORD_HASH,
  WG_PATH: process.env.WG_PATH || '/etc/wireguard/',
  WG_HOST: process.env.WG_HOST || '',
  WG_PORT: Number(process.env.WG_PORT || '51820'),
  WG_CONFIG_PORT: Number(process.env.WG_CONFIG_PORT || '51820'),
  WG_MANAGED: !!process.env.WG_MANAGED || undefined,
  WG_MTU: process.env.WG_MTU ? Number(process.env.WG_MTU) : undefined,
  WG_PERSISTENT_KEEPALIVE: Number(process.env.WG_PERSISTENT_KEEPALIVE || '0'),
  WG_DEFAULT_ADDRESS: process.env.WG_DEFAULT_ADDRESS || '10.8.0.x',
  WG_DEFAULT_DNS: typeof process.env.WG_DEFAULT_DNS == 'string'
    ? process.env.WG_DEFAULT_DNS
    : '1.1.1.1',
  WG_ALLOWED_IPS: process.env.WG_ALLOWED_IPS || '0.0.0.0/0, ::/0',
  WG_PRE_UP: process.env.WG_PRE_UP,
  WG_POST_UP: process.env.WG_POST_UP,
  WG_PRE_DOWN: process.env.WG_PRE_DOWN,
  WG_POST_DOWN: process.env.WG_POST_DOWN,
} satisfies Environment



















