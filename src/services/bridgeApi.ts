import axios from 'axios';
import { MigrationRequest, MigrationResponse, MigrationStatusResponse, CONFIG } from '@/types/bridge';

const api = axios.create({
  baseURL: CONFIG.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': CONFIG.authToken ? `Bearer ${CONFIG.authToken}` : '',
  },
});

export const migrationApi = {
  async submitMigration(request: MigrationRequest): Promise<MigrationResponse> {
    try {
      const response = await api.post('/v2/token-migration/burn', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        const errorResponse = error.response?.data;

        // Handle specific error types with more detailed messages
        if (message.includes('Insufficient token balance')) {
          throw new Error('Insufficient token balance. Please check your wallet balance and try again.');
        }

        if (message.includes('Migration failed')) {
          const errorWithContext = new Error('Migration failed. Please check the transaction status and contact support if needed.');
          (errorWithContext as Error & { originalResponse?: typeof errorResponse }).originalResponse = errorResponse;
          throw errorWithContext;
        }

        throw new Error(message);
      }
      throw error;
    }
  },

  async getStatus(migrationId: string): Promise<MigrationStatusResponse> {
    try {
      const response = await api.get(`/v2/token-migration/status/${migrationId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },

  async getProgress(migrationId: string): Promise<MigrationStatusResponse> {
    try {
      const response = await api.get(`/v2/token-migration/progress/${migrationId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },
};

export const generateMigrationId = (): string => {
  return crypto.randomUUID();
};

export const formatTokenAmount = (amount: string, decimals: number = 18): string => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return '0';

  // Return the amount as string with 18 decimals as required by the new API
  return (num * Math.pow(10, decimals)).toString();
};

export const getExplorerUrl = (hash: string, network: 'base' | 'solana'): string => {
  if (network === 'base') {
    return `${CONFIG.baseExplorerUrl}/tx/${hash}`;
  }
  return `${CONFIG.solanaExplorerUrl}/tx/${hash}?cluster=${CONFIG.solanaNetwork}`;
};