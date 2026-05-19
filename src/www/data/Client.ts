interface Client {
  id: string;
  name: string;
  address: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  latestHandshakeAt: Date | null
  transferRx: number | null
  transferTx: number | null
}

export default Client;