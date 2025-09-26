import { create } from 'zustand';
import {
  MigrationFormData,
  MigrationStep,
  MigrationStatus,
  MigrationTransactionData,
  MigrationVestingData,
  ErrorDisplay,
  TokenMigrationStatus
} from '@/types/bridge';

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
  setError: (error: ErrorDisplay | null) => void;
  reset: () => void;
}

export const useMigrationStore = create<MigrationState>((set) => ({
  // Initial state
  step: 'form',
  status: 'idle',
  loading: false,
  formData: null,
  transactionData: null,
  vestingData: null,
  migrationId: null,
  error: null,

  // Actions
  setFormData: (data) => set({ formData: data }),
  setStep: (step) => set({ step }),
  setStatus: (status) => set({ status }),
  setLoading: (loading) => set({ loading }),
  setTransactionData: (data) => set({ transactionData: data }),
  setVestingData: (data) => set({ vestingData: data }),
  setMigrationId: (id) => set({ migrationId: id }),
  setError: (error) => set({ error }),
  reset: () => set({
    step: 'form',
    status: 'idle',
    loading: false,
    formData: null,
    transactionData: null,
    vestingData: null,
    migrationId: null,
    error: null,
  }),
}));