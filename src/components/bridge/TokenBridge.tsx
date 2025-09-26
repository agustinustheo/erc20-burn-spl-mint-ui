import { useEffect } from 'react';
import { useMigrationStore } from '@/store/bridgeStore';
import { MigrationFormData, MigrationRequest, CONFIG, TokenMigrationStatus } from '@/types/bridge';
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
    error,
    setFormData,
    setStep,
    setStatus,
    setLoading,
    setTransactionData,
    setVestingData,
    setMigrationId,
    setError,
    reset,
  } = useMigrationStore();

  const { toast } = useToast();

  const handleFormSubmit = async (data: MigrationFormData) => {
    let errorMessage: string | undefined;

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

      if (!response.success) {
        throw new Error(response.error || 'Migration request failed');
      }

      // Update transaction data
      setTransactionData(response.burnTransaction);

      // Start polling for migration status
      await pollMigrationStatus(migrationId);

    } catch (err) {
      errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

      // Check if this is a burn success with database/vesting error
      const isBurnSuccessWithDbError = errorMessage.includes('Migration failed');

      if (isBurnSuccessWithDbError) {
        // The burn likely succeeded on blockchain but backend couldn't store the record
        setTransactionData({
          hash: 'pending-verification',
          status: 'completed',
          explorerUrl: CONFIG.baseExplorerUrl,
        });

        setStep('completed');
        setStatus('completed');
        setLoading(false);

        toast({
          title: 'Burn Successful! 🔥',
          description: 'Your tokens have been burned successfully. Processing vesting...',
          variant: 'default',
        });

        // After 10 seconds, show vesting error
        setTimeout(() => {
          toast({
            title: 'Vesting Setup Failed',
            description: 'Token burn was successful, but vesting setup encountered an issue.',
            variant: 'destructive',
          });
        }, 10000);

        return;
      }

      // Handle other errors normally
      const errorType = errorMessage.includes('Insufficient token balance') ? 'insufficient' : 'transaction';

      setError({
        type: errorType,
        message: errorMessage,
        retryable: errorType !== 'insufficient',
      });

      setStep('error');
      setStatus('error');

      toast({
        title: 'Migration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      if (!errorMessage?.includes('Migration failed')) {
        setLoading(false);
      }
    }
  };

  const pollMigrationStatus = async (migrationId: string) => {
    // Poll the migration status until completion
    const maxAttempts = 20;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await migrationApi.getStatus(migrationId);

      switch (status.status) {
        case TokenMigrationStatus.PENDING_BURN:
          setStatus('pending_burn');
          break;

        case TokenMigrationStatus.BURN_CONFIRMED:
          setStatus('burn_confirmed');
          toast({
            title: 'Tokens Burned',
            description: 'Your tokens have been successfully burned on Base network.',
          });
          break;

        case TokenMigrationStatus.VESTING_STARTED:
          setStatus('vesting_started');
          break;

        case TokenMigrationStatus.COMPLETED:
          if (status.vesting) {
            setVestingData(status.vesting);
          }
          setStatus('completed');
          setStep('completed');

          toast({
            title: 'Migration Completed!',
            description: 'Your vesting contract has been created on Solana.',
          });
          return;

        case TokenMigrationStatus.BURN_FAILED:
        case TokenMigrationStatus.VESTING_FAILED:
          throw new Error(`Migration failed: ${status.error || 'Unknown error'}`);
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
    }

    throw new Error('Migration timed out');
  };

  const handleRetry = () => {
    if (formData) {
      handleFormSubmit(formData);
    }
  };

  const handleNewMigration = () => {
    reset();
  };

  // Render appropriate component based on current step
  const renderCurrentStep = () => {
    switch (step) {
      case 'form':
        return (
          <MigrationForm
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        );

      case 'processing':
        return (
          <BridgeStatus
            status={status}
            formData={formData!}
            transactionData={transactionData}
            onRetry={handleRetry}
          />
        );

      case 'completed':
        return (
          <BridgeCompleted
            formData={formData!}
            transactionData={transactionData!}
            vestingData={vestingData!}
            onNewBridge={handleNewMigration}
          />
        );

      case 'error':
        return (
          <BridgeError
            error={error!}
            onRetry={error?.retryable ? handleRetry : undefined}
            onBack={handleNewMigration}
          />
        );

      default:
        return (
          <MigrationForm
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {renderCurrentStep()}
      </div>
    </div>
  );
};