export interface BridgeFormData {
  accountId: string;
  tokenAddress: string;
  amount: string;
  solanaWalletAddress: string;
  vestingDurationDays: number;
}

export interface BridgeRequest extends BridgeFormData {
  bridgeId: string;
  chainId: number;
  startImmediately: boolean;
}

export interface TransactionData {
  hash: string;
  blockNumber?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  explorerUrl?: string;
}

export interface VestingData {
  contractAddress: string;
  amount: string;
  duration: number;
  startDate: string;
  endDate: string;
  explorerUrl?: string;
}

export interface BridgeResponse {
  success: boolean;
  bridgeId: string;
  burnTransaction: TransactionData;
  vesting?: VestingData;
  error?: string;
}

export type BridgeStep = 'form' | 'processing' | 'completed' | 'error';

export type BridgeStatus = 
  | 'idle'
  | 'burning'
  | 'burned'
  | 'vesting'
  | 'completed'
  | 'error';

export interface ErrorDisplay {
  type: 'network' | 'validation' | 'insufficient' | 'transaction' | 'vesting';
  message: string;
  details?: string;
  retryable: boolean;
}

export const POPULAR_TOKENS = {
  PENGU: import.meta.env.VITE_PENGU_TOKEN_ADDRESS || '0x4e0dEBF0c8795A7861A64Df7F136f989921d0247',
  AIKA: import.meta.env.VITE_AIKA_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const;

export const CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_URL || 'https://0ebce1a88279.ngrok-free.app',
  authToken: import.meta.env.VITE_AUTH_TOKEN || '',
  baseChainId: parseInt(import.meta.env.VITE_BASE_CHAIN_ID || '8453'),
  solanaNetwork: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
  defaultVestingDuration: parseInt(import.meta.env.VITE_DEFAULT_VESTING_DURATION || '90'),
  baseExplorerUrl: import.meta.env.VITE_BASE_EXPLORER_URL || 'https://basescan.org',
  solanaExplorerUrl: import.meta.env.VITE_SOLANA_EXPLORER_URL || 'https://explorer.solana.com',
} as const;