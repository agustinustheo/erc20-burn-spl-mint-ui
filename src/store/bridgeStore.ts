import { create } from 'zustand';
import { BridgeFormData, BridgeStep, BridgeStatus, TransactionData, VestingData, ErrorDisplay } from '@/types/bridge';

interface BridgeState {
  // Current state
  step: BridgeStep;
  status: BridgeStatus;
  loading: boolean;

  // Form data
  formData: BridgeFormData | null;

  // Transaction and vesting data
  transactionData: TransactionData | null;
  vestingData: VestingData | null;

  // Error handling
  error: ErrorDisplay | null;

  // Actions
  setFormData: (data: BridgeFormData) => void;
  setStep: (step: BridgeStep) => void;
  setStatus: (status: BridgeStatus) => void;
  setLoading: (loading: boolean) => void;
  setTransactionData: (data: TransactionData) => void;
  setVestingData: (data: VestingData) => void;
  setError: (error: ErrorDisplay | null) => void;
  reset: () => void;
}

export const useBridgeStore = create<BridgeState>((set) => ({
  // Initial state
  step: 'form',
  status: 'idle',
  loading: false,
  formData: null,
  transactionData: null,
  vestingData: null,
  error: null,

  // Actions
  setFormData: (data) => set({ formData: data }),
  setStep: (step) => set({ step }),
  setStatus: (status) => set({ status }),
  setLoading: (loading) => set({ loading }),
  setTransactionData: (data) => set({ transactionData: data }),
  setVestingData: (data) => set({ vestingData: data }),
  setError: (error) => set({ error }),
  reset: () => set({
    step: 'form',
    status: 'idle',
    loading: false,
    formData: null,
    transactionData: null,
    vestingData: null,
    error: null,
  }),
}));