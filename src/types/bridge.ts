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
  migrationId: string;
  accountId: string;
  status: TokenMigrationStatus;
  tokenAddress: string;
  amount: string;
  chainId: number;
  solanaRecipientAddress: string;
  burnTransactionHash?: string;
  burnBlockNumber?: number;
  vestingContractAddress?: string;
  solanaTransactionHash?: string;
  vestingStartDate?: string;
  vestingEndDate?: string;
  dailyReleaseAmount?: string;
  createdAt: string;
  updatedAt: string;
  burnTransaction?: MigrationTransactionData;
  vesting?: MigrationVestingData;
  error?: string;
}

export interface MigrationStatusResponse {
  migrationId: string;
  accountId: string;
  status: TokenMigrationStatus;
  tokenAddress: string;
  amount: string;
  chainId: number;
  solanaRecipientAddress: string;
  burnTransactionHash?: string;
  burnBlockNumber?: number;
  vestingContractAddress?: string;
  solanaTransactionHash?: string;
  vestingStartDate?: string;
  vestingEndDate?: string;
  dailyReleaseAmount?: string;
  createdAt: string;
  updatedAt: string;
  burnTransaction?: MigrationTransactionData;
  vesting?: MigrationVestingData;
  error?: string;
}

export interface MigrationProgressResponse {
  status: TokenMigrationStatus;
  vestingProgress: number;
  vestedAmount: string;
  remainingAmount: string;
  daysRemaining: number;
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

// Solana devnet USDC configuration
export const SOLANA_TOKENS = {
  USDC_DEVNET: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
} as const;

export const CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_URL,
  authToken: import.meta.env.VITE_AUTH_TOKEN,
  baseChainId: parseInt(import.meta.env.VITE_BASE_CHAIN_ID || '8453'),
  solanaNetwork: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
  defaultVestingDuration: parseInt(import.meta.env.VITE_DEFAULT_VESTING_DURATION || '90'),
  baseExplorerUrl: import.meta.env.VITE_BASE_EXPLORER_URL || 'https://basescan.org',
  solanaExplorerUrl: import.meta.env.VITE_SOLANA_EXPLORER_URL || 'https://explorer.solana.com',
  statusPollingInterval: parseInt(import.meta.env.VITE_STATUS_POLLING_INTERVAL || '30000'), // 30 seconds as per requirement
  maxPollingAttempts: parseInt(import.meta.env.VITE_MAX_POLLING_ATTEMPTS || '120'), // 60 minutes max (120 * 30s = 3600s)
  testAmount: import.meta.env.VITE_TEST_AMOUNT || '100', // 100 USDC for testing
} as const;