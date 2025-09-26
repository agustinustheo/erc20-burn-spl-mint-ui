export interface MigrationFormData {
  accountId: string;
  tokenAddress: string;
  amount: string;
  solanaRecipientAddress: string;
  vestingDurationDays: number;
}

export interface MigrationRequest extends MigrationFormData {
  migrationId: string;
  chainId: number;
  webhookUrl?: string;
}

export interface MigrationTransactionData {
  hash: string;
  blockNumber?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  explorerUrl?: string;
}

export interface MigrationVestingData {
  contractAddress: string;
  amount: string;
  duration: number;
  startDate: string;
  endDate: string;
  explorerUrl?: string;
}

export interface MigrationResponse {
  success: boolean;
  migrationId: string;
  burnTransaction: MigrationTransactionData;
  vesting?: MigrationVestingData;
  error?: string;
}

export interface MigrationStatusResponse {
  migrationId: string;
  status: TokenMigrationStatus;
  burnTransaction?: MigrationTransactionData;
  vesting?: MigrationVestingData;
  error?: string;
  progress?: {
    currentStep: number;
    totalSteps: number;
    message: string;
  };
}

export type MigrationStep = 'form' | 'processing' | 'completed' | 'error';

export type MigrationStatus =
  | 'idle'
  | 'pending_burn'
  | 'burn_confirmed'
  | 'vesting_started'
  | 'completed'
  | 'error';

export enum TokenMigrationStatus {
  PENDING_BURN = 'pending_burn',
  BURN_CONFIRMED = 'burn_confirmed',
  BURN_FAILED = 'burn_failed',
  VESTING_STARTED = 'vesting_started',
  VESTING_FAILED = 'vesting_failed',
  COMPLETED = 'completed'
}

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