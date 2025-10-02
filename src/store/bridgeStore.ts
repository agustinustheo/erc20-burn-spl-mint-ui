import { create } from 'zustand';
import {
  MigrationFormData,
  MigrationStep,
  MigrationStatus,
  MigrationTransactionData,
  MigrationVestingData,
  ErrorDisplay,
  TokenMigrationStatus,
  MigrationStatusResponse,
  MigrationProgressResponse
} from '@/types/bridge';
import { migrationApi } from '@/services/bridgeApi';

interface MigrationState {
  // Current state
  step: MigrationStep;
  status: MigrationStatus;
  loading: boolean;

  // Form data
  formData: MigrationFormData | null;

  // Transaction and vesting data
  transactionData: MigrationTransactionData | null;
  vestingData: MigrationVestingData | null;

  // Migration tracking
  migrationId: string | null;
  currentMigrationStatus: TokenMigrationStatus | null;
  statusMessage: string | null;
  isPolling: boolean;

  // Vesting progress tracking
  vestingProgress: number | null;
  vestedAmount: string | null;
  remainingAmount: string | null;
  daysRemaining: number | null;

  // Error handling
  error: ErrorDisplay | null;

  // Actions
  setFormData: (data: MigrationFormData) => void;
  setStep: (step: MigrationStep) => void;
  setStatus: (status: MigrationStatus) => void;
  setLoading: (loading: boolean) => void;
  setTransactionData: (data: MigrationTransactionData) => void;
  setVestingData: (data: MigrationVestingData) => void;
  setMigrationId: (id: string | null) => void;
  setCurrentMigrationStatus: (status: TokenMigrationStatus | null) => void;
  setStatusMessage: (message: string | null) => void;
  setIsPolling: (polling: boolean) => void;
  setError: (error: ErrorDisplay | null) => void;
  startMigrationPolling: (migrationId: string) => void;
  stopMigrationPolling: () => void;
  updateFromStatusResponse: (response: MigrationStatusResponse) => void;
  updateFromProgressResponse: (response: MigrationProgressResponse) => void;
  reset: () => void;
}

export const useMigrationStore = create<MigrationState>((set, get) => ({
  // Initial state
  step: 'form',
  status: 'idle',
  loading: false,
  formData: null,
  transactionData: null,
  vestingData: null,
  migrationId: null,
  currentMigrationStatus: null,
  statusMessage: null,
  isPolling: false,
  vestingProgress: null,
  vestedAmount: null,
  remainingAmount: null,
  daysRemaining: null,
  error: null,

  // Actions
  setFormData: (data) => set({ formData: data }),
  setStep: (step) => set({ step }),
  setStatus: (status) => set({ status }),
  setLoading: (loading) => set({ loading }),
  setTransactionData: (data) => set({ transactionData: data }),
  setVestingData: (data) => set({ vestingData: data }),
  setMigrationId: (id) => set({ migrationId: id }),
  setCurrentMigrationStatus: (status) => set({ currentMigrationStatus: status }),
  setStatusMessage: (message) => set({ statusMessage: message }),
  setIsPolling: (polling) => set({ isPolling: polling }),
  setError: (error) => set({ error }),

  startMigrationPolling: (migrationId: string) => {
    const state = get();
    if (state.isPolling) {
      return; // Already polling
    }

    if (!migrationId) {
      set({
        error: {
          type: 'validation',
          message: 'Invalid migration ID',
          details: 'Cannot start polling without a valid migration ID',
          retryable: false
        }
      });
      return;
    }

    set({ isPolling: true, statusMessage: 'Migration initiated, checking status...' });

    migrationApi.pollMigrationStatus(
      migrationId,
      async (statusResponse) => {
        const currentState = get();
        if (!currentState.isPolling) {
          return; // Polling was stopped
        }

        currentState.updateFromStatusResponse(statusResponse);
        
        // If vesting has started, also fetch progress data
        if (statusResponse.status === 'vesting_started' || statusResponse.status === 'completed') {
          try {
            const progressResponse = await migrationApi.getProgress(migrationId);
            currentState.updateFromProgressResponse(progressResponse);
          } catch (error) {
            console.warn('Failed to fetch vesting progress:', error);
          }
        }
      },
      (error) => {
        set({
          isPolling: false,
          error: {
            type: 'network',
            message: 'Failed to check migration status',
            details: error.message,
            retryable: true
          }
        });
      }
    );
  },

  stopMigrationPolling: () => {
    set({ isPolling: false });
  },

  updateFromStatusResponse: (response: MigrationStatusResponse) => {
    const statusMessages: Record<string, string> = {
      'pending_burn': 'Processing token burn transaction...',
      'burn_confirmed': 'Token burn confirmed, creating vesting contract...',
      'vesting_started': 'Vesting contract created successfully! Your tokens are now vesting.',
      'completed': 'Migration completed successfully!',
      'burn_failed': 'Token burn failed. Please try again.',
      'vesting_failed': 'Vesting creation failed. Please contact support.'
    };

    if (!response || !response.status) {
      set({
        error: {
          type: 'network',
          message: 'Invalid response received from server',
          details: 'Response missing status field',
          retryable: true
        },
        isPolling: false
      });
      return;
    }

    const isCompleted = migrationApi.isFinalStatus(response.status);
    
    const currentState = get();

    set({
      currentMigrationStatus: response.status as TokenMigrationStatus,
      statusMessage: statusMessages[response.status] || `Status: ${response.status}`,
      isPolling: !isCompleted,
      step: isCompleted ? 'completed' : 'processing',
      status: response.status === 'vesting_started' || response.status === 'completed' ? 'completed' :
              (response.status && response.status.includes('failed')) ? 'error' : 'pending_burn',
      transactionData: response.burnTransactionHash ? {
        hash: response.burnTransactionHash,
        blockNumber: response.burnBlockNumber,
        status: response.status.includes('failed') ? 'failed' : 'confirmed'
      } : null,
      vestingData: response.vestingContractAddress ? {
        contractAddress: response.vestingContractAddress,
        amount: response.amount,
        duration: currentState.formData?.vestingDurationDays,
        startDate: response.vestingStartDate || response.createdAt,
        endDate: response.vestingEndDate || response.updatedAt
      } : null
    });
  },

  updateFromProgressResponse: (response: MigrationProgressResponse) => {
    set({
      vestingProgress: response.vestingProgress,
      vestedAmount: response.vestedAmount,
      remainingAmount: response.remainingAmount,
      daysRemaining: response.daysRemaining,
      currentMigrationStatus: response.status
    });
  },

  reset: () => set({
    step: 'form',
    status: 'idle',
    loading: false,
    formData: null,
    transactionData: null,
    vestingData: null,
    migrationId: null,
    currentMigrationStatus: null,
    statusMessage: null,
    isPolling: false,
    vestingProgress: null,
    vestedAmount: null,
    remainingAmount: null,
    daysRemaining: null,
    error: null,
  }),
}));