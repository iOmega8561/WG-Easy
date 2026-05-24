import Client from "./Client";

interface ServerData {
  server: {
    publicKey: string,
    privateKey: string,
    address: string
  },
  clients: { [key: string]: Client }
}

export default ServerData