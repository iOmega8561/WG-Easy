interface Client {
  id: string,
  name: string,
  enabled: boolean,
  address: string,
  publicKey: string,
  privateKey?: string,
  preSharedKey?: string,
  createdAt: Date,
  updatedAt: Date,
  allowedIPs: string | undefined,
  downloadableConfig?: boolean,
  persistentKeepalive?: number,
  latestHandshakeAt?: Date,
  transferRx?: number,
  transferTx?: number,
}

export default Client;