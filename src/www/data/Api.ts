import axios from 'axios';
import Client from "./Client";

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

const Api = {
  getSession: () => apiClient.get('/session').then(res => res.data),
  createSession: (password: string) => apiClient.post('/session', { password }),
  deleteSession: () => apiClient.delete('/session'),
  
  getClients: (): Promise<Client[]> => apiClient.get('/wireguard/client').then(res => res.data),
  createClient: (name: string) => apiClient.post('/wireguard/client', { name }),
  deleteClient: (clientId: string) => apiClient.delete(`/wireguard/client/${clientId}`),
  enableClient: (clientId: string) => apiClient.post(`/wireguard/client/${clientId}/enable`),
  disableClient: (clientId: string) => apiClient.post(`/wireguard/client/${clientId}/disable`),
  updateClientName: (clientId: string, name: string) => apiClient.put(`/wireguard/client/${clientId}/name`, { name }),
  updateClientAddress: (clientId: string, address: string) => apiClient.put(`/wireguard/client/${clientId}/address`, { address }),
  
  restoreConfiguration: (file: File) => apiClient.put('/wireguard/restore', { file }),
};

export default Api;