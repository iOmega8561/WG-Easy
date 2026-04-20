interface Client {
  id: string;
  name: string;
  address: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  downloadableConfig: boolean;
}

export default Client;