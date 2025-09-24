import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BridgeStatus as Status, BridgeFormData, TransactionData, POPULAR_TOKENS, CONFIG } from '@/types/bridge';
import { Flame, ArrowRightLeft, CheckCircle, AlertCircle, ExternalLink, Clock } from 'lucide-react';
import { getExplorerUrl } from '@/services/bridgeApi';
import { formatTokenAmount, getTokenDecimals } from '@/lib/utils';

interface BridgeStatusProps {
  status: Status;
  formData: BridgeFormData;
  transactionData?: TransactionData | null;
  onRetry?: () => void;
}

const StatusIndicator = ({ status }: { status: Status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'burning':
        return <Flame className="w-5 h-5 text-primary animate-pulse" />;
      case 'burned':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'vesting':
        return <ArrowRightLeft className="w-5 h-5 text-secondary animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'burning':
        return 'Burning tokens...';
      case 'burned':
        return 'Tokens burned successfully';
      case 'vesting':
        return 'Creating Solana vesting...';
      case 'completed':
        return 'Bridge completed successfully';
      case 'error':
        return 'Bridge failed';
      default:
        return 'Preparing...';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'burning':
      case 'vesting':
        return 'status-processing';
      case 'burned':
      case 'completed':
        return 'status-completed';
      case 'error':
        return 'status-error';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`status-indicator ${getStatusClass()}`}>
        {getStatusIcon()}
      </div>
      <span className="font-medium">{getStatusText()}</span>
    </div>
  );
};

const StepProgress = ({ status }: { status: Status }) => {
  const steps = [
    { key: 'burning', label: 'Burn Tokens', icon: Flame },
    { key: 'vesting', label: 'Create Vesting', icon: ArrowRightLeft },
  ];

  const getStepStatus = (stepKey: string) => {
    switch (stepKey) {
      case 'burning':
        if (status === 'burning') return 'processing';
        if (['burned', 'vesting', 'completed'].includes(status)) return 'completed';
        if (status === 'error') return 'error';
        return 'pending';
      case 'vesting':
        if (status === 'vesting') return 'processing';
        if (status === 'completed') return 'completed';
        if (status === 'error' && ['burned', 'vesting'].includes(status)) return 'error';
        return 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.key);
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center gap-4">
            <div className={`status-indicator status-${stepStatus}`}>
              <Icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">Step {index + 1}: {step.label}</span>
                <div className="flex items-center gap-2">
                  {stepStatus === 'pending' && (
                    <span className="text-sm text-muted-foreground">Pending</span>
                  )}
                  {stepStatus === 'processing' && (
                    <span className="text-sm text-warning-foreground">Processing</span>
                  )}
                  {stepStatus === 'completed' && (
                    <span className="text-sm text-success-foreground">Completed</span>
                  )}
                  {stepStatus === 'error' && (
                    <span className="text-sm text-destructive-foreground">Failed</span>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-6 ml-3 mt-2 ${
                  stepStatus === 'completed' ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const BridgeStatus = ({ status, formData, transactionData, onRetry }: BridgeStatusProps) => {
  const tokenSymbol = formData.tokenAddress.toLowerCase() === POPULAR_TOKENS.PENGU.toLowerCase() ? 'PENGU' : 'TOKEN';

  return (
    <Card className="bridge-card w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ArrowRightLeft className="w-8 h-8 text-secondary" />
          <CardTitle className="text-2xl font-bold">
            Bridge in Progress
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <StatusIndicator status={status} />
        </div>

        <div className="bg-accent/50 rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-accent-foreground">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token:</span>
              <span className="font-mono">{tokenSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-mono">{formatTokenAmount(formData.amount, getTokenDecimals(formData.tokenAddress))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vesting Duration:</span>
              <span>{formData.vestingDurationDays} days</span>
            </div>
            {transactionData?.hash && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction:</span>
                {transactionData.hash === 'pending-verification' ? (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-warning-foreground">Verification needed</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(CONFIG.baseExplorerUrl, '_blank')}
                      className="h-6 px-2 text-xs"
                    >
                      Check on Basescan
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getExplorerUrl(transactionData.hash, 'base'), '_blank')}
                    className="h-6 px-2 text-xs"
                  >
                    <span className="font-mono text-xs">
                      {transactionData.hash.slice(0, 8)}...{transactionData.hash.slice(-6)}
                    </span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <StepProgress status={status} />

        {status === 'error' && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="w-full"
          >
            Retry Bridge
          </Button>
        )}
      </CardContent>
    </Card>
  );
};