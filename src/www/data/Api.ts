import axios from 'axios';
import { toast } from 'react-toastify';

import Client from './Client';
import Response from './Response';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;

    if (message)
      toast.error(message);
  
    throw error;
  }
);

const Api = {
  getRelease: (): Promise<string> => 
    apiClient.get('/release').then(res => res.data),

  getSession: (): Promise<Response.Session> => 
    apiClient.get('/session').then(res => res.data),

  createSession: (password: string): Promise<Response.Success> => 
    apiClient.post('/session', { password }).then(res => res.data),

  deleteSession: (): Promise<Response.Success> => 
    apiClient.delete('/session').then(res => res.data),
  
  getClients: (): Promise<Client[]> => 
    apiClient.get('/wireguard/client').then(res => res.data),

  createClient: (name: string): Promise<Response.Success> => 
    apiClient.post('/wireguard/client', { name }).then(res => res.data),

  deleteClient: (clientId: string): Promise<Response.Success> => 
    apiClient.delete(`/wireguard/client/${clientId}`).then(res => res.data),

  enableClient: (clientId: string): Promise<Response.Success> => 
    apiClient.post(`/wireguard/client/${clientId}/enable`).then(res => res.data),

  disableClient: (clientId: string): Promise<Response.Success> => 
    apiClient.post(`/wireguard/client/${clientId}/disable`).then(res => res.data),

  updateClientName: (clientId: string, name: string): Promise<Response.Success> => 
    apiClient.put(`/wireguard/client/${clientId}/name`, { name }).then(res => res.data),

  updateClientAddress: (clientId: string, address: string): Promise<Response.Success> => 
    apiClient.put(`/wireguard/client/${clientId}/address`, { address }).then(res => res.data),

  downloadConfiguration: (clientId: string) => {
    window.location.href = `/api/wireguard/client/${clientId}/configuration`;
  },

  downloadBackup: () => {
    window.location.href = `/api/wireguard/backup`;
  },

  restoreConfiguration: async (file: File): Promise<Response.Success> => {
    return apiClient.put('/wireguard/restore', { file: await file.text() }).then(res => res.data);
  },
};

export default Api;