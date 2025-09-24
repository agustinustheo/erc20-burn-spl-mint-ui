import axios from 'axios';
import { BridgeRequest, BridgeResponse, CONFIG } from '@/types/bridge';

const api = axios.create({
  baseURL: CONFIG.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': CONFIG.authToken ? `Bearer ${CONFIG.authToken}` : '',
  },
});

export const bridgeApi = {
  async submitBridge(request: BridgeRequest): Promise<BridgeResponse> {
    try {
      const response = await api.post('/api/v2/bridge-aika', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        const errorResponse = error.response?.data;
        
        // Handle specific error types with more detailed messages
        if (message.includes('Insufficient token balance')) {
          throw new Error('Insufficient token balance. Please check your wallet balance and try again.');
        }
        
        if (message.includes('column "status" of relation "bridges" does not exist')) {
          throw new Error('Database configuration issue. The backend database schema needs to be updated. Please contact support.');
        }
        
        if (message.includes('Failed to store burn record')) {
          // Include the full error response for transaction hash extraction
          const errorWithContext = new Error('Database error occurred while processing your transaction. The burn may have succeeded but could not be recorded. Please check the blockchain explorer and contact support.');
          (errorWithContext as Error & { originalResponse?: typeof errorResponse }).originalResponse = errorResponse;
          throw errorWithContext;
        }

        if (message.includes('Failed to complete burn-to-vest operation')) {
          // Include the full error response for transaction hash extraction
          const errorWithContext = new Error('The burn operation encountered an issue. Please check the transaction status and contact support if needed.');
          (errorWithContext as Error & { originalResponse?: typeof errorResponse }).originalResponse = errorResponse;
          throw errorWithContext;
        }
        
        throw new Error(message);
      }
      throw error;
    }
  },

  async getStatus(bridgeId: string): Promise<BridgeResponse> {
    try {
      const response = await api.get(`/api/v2/bridge-aika/${bridgeId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },
};

export const generateBridgeId = (): string => {
  return crypto.randomUUID();
};

export const formatTokenAmount = (amount: string, decimals: number = 18): string => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return '0';
  
  // Return the amount as-is since the backend expects raw token amounts
  // The backend will handle any necessary decimal conversions
  return Math.floor(num).toString();
};

export const getExplorerUrl = (hash: string, network: 'base' | 'solana'): string => {
  if (network === 'base') {
    return `${CONFIG.baseExplorerUrl}/tx/${hash}`;
  }
  return `${CONFIG.solanaExplorerUrl}/tx/${hash}?cluster=${CONFIG.solanaNetwork}`;
};