import { useEffect } from 'react';
import { useMigrationStore } from '@/store/bridgeStore';
import {
  MigrationFormData,
  MigrationRequest,
  CONFIG,
} from '@/types/bridge';
import { migrationApi, generateMigrationId, formatTokenAmount } from '@/services/bridgeApi';
import { MigrationForm } from './BridgeForm';
import { BridgeStatus } from './BridgeStatus';
import { BridgeCompleted } from './BridgeCompleted';
import { BridgeError } from './BridgeError';
import { useToast } from '@/hooks/use-toast';

export const TokenBridge = () => {
  const {
    step,
    status,
    loading,
    formData,
    transactionData,
    vestingData,
    migrationId,
    statusMessage,
    isPolling,
    vestingProgress,
    vestedAmount,
    remainingAmount,
    daysRemaining,
    error,
    setFormData,
    setStep,
    setStatus,
    setLoading,
    setTransactionData,
    setVestingData,
    setMigrationId,
    setError,
    startMigrationPolling,
    stopMigrationPolling,
    reset,
  } = useMigrationStore();

  const { toast } = useToast();

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (isPolling) {
        stopMigrationPolling();
      }
    };
  }, [isPolling, stopMigrationPolling]);

  const handleFormSubmit = async (data: MigrationFormData) => {
    try {
      setFormData(data);
      setStep('processing');
      setStatus('pending_burn');
      setLoading(true);
      setError(null);

      // Prepare migration request
      const migrationId = generateMigrationId();
      setMigrationId(migrationId);

      const request: MigrationRequest = {
        ...data,
        migrationId,
        chainId: CONFIG.baseChainId,
        amount: formatTokenAmount(data.amount),
      };

      // Submit migration request
      const response = await migrationApi.submitMigration(request);

      // Validate response has required fields instead of checking success field
      if (!response.migrationId || !response.status) {
        throw new Error(response.error || 'Invalid migration response received');
      }

      // Show success message
      toast({
        title: 'Migration Initiated',
        description: 'Your token migration has been started successfully. We\'ll track the progress for you.',
      });

      // Start polling for migration status
      startMigrationPolling(migrationId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

      // Determine error type for better handling
      let errorType: 'network' | 'validation' | 'insufficient' | 'transaction' | 'vesting';
      let retryable = true;

      if (errorMessage.includes('Insufficient token balance')) {
        errorType = 'insufficient';
        retryable = false;
      } else if (errorMessage.includes('Invalid') || errorMessage.includes('validation')) {
        errorType = 'validation';
        retryable = false;
      } else if (errorMessage.includes('vesting') || errorMessage.includes('Vesting')) {
        errorType = 'vesting';
      } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
        errorType = 'network';
      } else {
        errorType = 'transaction';
      }

      setError({
        type: errorType,
        message: errorMessage,
        retryable,
      });

      setStep('error');
      setStatus('error');

      toast({
        title: 'Migration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (formData) {
      handleFormSubmit(formData);
    }
  };

  const handleReset = () => {
    stopMigrationPolling();
    reset();
  };

  // Render based on current step
  switch (step) {
    case 'form':
      return <MigrationForm onSubmit={handleFormSubmit} />;

    case 'processing':
      return (
        <BridgeStatus
          status={status}
          transactionData={transactionData}
          vestingData={vestingData}
          statusMessage={statusMessage}
          isPolling={isPolling}
          vestingProgress={vestingProgress}
          vestedAmount={vestedAmount}
          remainingAmount={remainingAmount}
          daysRemaining={daysRemaining}
        />
      );

    case 'completed':
      return (
        <BridgeCompleted
          transactionData={transactionData}
          vestingData={vestingData}
          onReset={handleReset}
        />
      );

    case 'error':
      return (
        <BridgeError
          error={error}
          onRetry={handleRetry}
          onReset={handleReset}
        />
      );

    default:
      return <MigrationForm onSubmit={handleFormSubmit} />;
  }
};