import axios from 'axios';
import { MigrationRequest, MigrationResponse, MigrationStatusResponse, MigrationProgressResponse, CONFIG } from '@/types/bridge';

const api = axios.create({
  baseURL: CONFIG.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Function to set auth token dynamically
export const setApiAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

if (CONFIG.authToken) {
  setApiAuthToken(CONFIG.authToken);
}

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

  async getProgress(migrationId: string): Promise<MigrationProgressResponse> {
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

  async pollMigrationStatus(
    migrationId: string,
    onStatusUpdate: (status: MigrationStatusResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (!migrationId) {
      onError(new Error('Invalid migration ID provided for polling'));
      return;
    }
    
    let attempts = 0;
    const maxAttempts = CONFIG.maxPollingAttempts;
    const interval = CONFIG.statusPollingInterval;

    const poll = async () => {
      try {
        attempts++;
        const status = await this.getStatus(migrationId);
        onStatusUpdate(status);

        // Continue polling if not in final state
        if (!this.isFinalStatus(status.status) && attempts < maxAttempts) {
          setTimeout(poll, interval);
        } else if (attempts >= maxAttempts) {
          onError(new Error('Migration is taking longer than expected. Please check status manually or wait for completion.'));
        }
      } catch (error) {
        // On API errors, continue polling instead of failing immediately
        if (attempts < maxAttempts) {
          setTimeout(poll, interval);
        } else {
          onError(new Error('Unable to check migration status. Please verify manually.'));
        }
      }
    };

    // Start polling immediately
    poll();
  },

  isFinalStatus(status: string): boolean {
    if (!status) {
      return false;
    }
    return ['vesting_started', 'completed'].includes(status);
  },
};

export const generateMigrationId = (): string => {
  return crypto.randomUUID();
};

export const formatTokenAmount = (amount: string, decimals: number = 18): string => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return '0';

  // Convert to integer to avoid floating point precision issues
  const integerAmount = Math.floor(num);
  
  const bigIntAmount = BigInt(integerAmount);
  
  return bigIntAmount.toString();
};

export const getExplorerUrl = (hash: string, network: 'base' | 'solana'): string => {
  if (network === 'base') {
    return `${CONFIG.baseExplorerUrl}/tx/${hash}`;
  }
  return `${CONFIG.solanaExplorerUrl}/tx/${hash}?cluster=${CONFIG.solanaNetwork}`;
};