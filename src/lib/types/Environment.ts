interface Environment {
  RELEASE: string,
  PORT: number,
  WEBUI_HOST: string,
  PASSWORD_HASH: string | undefined,
  WG_PATH: string,
  WG_HOST: string,
  WG_PORT: number,
  WG_CONFIG_PORT: number,
  WG_MANAGED: boolean | undefined,
  WG_MTU: number | undefined,
  WG_PERSISTENT_KEEPALIVE: number,
  WG_DEFAULT_ADDRESS: string,
  WG_DEFAULT_DNS: string,
  WG_ALLOWED_IPS: string,
  WG_PRE_UP: string | undefined,
  WG_POST_UP: string | undefined,
  WG_PRE_DOWN: string | undefined,
  WG_POST_DOWN: string | undefined
}

export default Environment