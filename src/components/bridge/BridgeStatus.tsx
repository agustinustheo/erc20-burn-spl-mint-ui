import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MigrationStatus, CONFIG } from '@/types/bridge';
import { Flame, ArrowRightLeft, CheckCircle, AlertCircle, ExternalLink, Clock, Loader2 } from 'lucide-react';
import { getExplorerUrl } from '@/services/bridgeApi';

interface BridgeStatusProps {
  status: MigrationStatus;
  transactionData?: any;
  vestingData?: any;
  statusMessage?: string;
  isPolling?: boolean;
  vestingProgress?: number | null;
  vestedAmount?: string | null;
  remainingAmount?: string | null;
  daysRemaining?: number | null;
}

const StatusIndicator = ({ status, statusMessage, isPolling }: { 
  status: MigrationStatus; 
  statusMessage?: string;
  isPolling?: boolean;
}) => {
  const getStatusIcon = () => {
    if (isPolling) {
      return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    }

    switch (status) {
      case 'pending_burn':
        return <Clock className="w-5 h-5 text-muted-foreground animate-pulse" />;
      case 'burn_confirmed':
        return <Flame className="w-5 h-5 text-primary" />;
      case 'vesting_started':
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
    if (statusMessage) {
      return statusMessage;
    }

    switch (status) {
      case 'pending_burn':
        return 'Preparing token burn...';
      case 'burn_confirmed':
        return 'Tokens burned successfully';
      case 'vesting_started':
        return 'Creating Solana vesting contract...';
      case 'completed':
        return 'Migration completed successfully';
      case 'error':
        return 'Migration failed';
      default:
        return 'Processing...';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'pending_burn':
        return 'text-muted-foreground';
      case 'burn_confirmed':
        return 'text-primary';
      case 'vesting_started':
        return 'text-secondary';
      case 'completed':
        return 'text-success';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={`flex items-center gap-3 ${getStatusClass()}`}>
      <div className="flex-shrink-0">
        {getStatusIcon()}
      </div>
      <span className="font-medium">{getStatusText()}</span>
    </div>
  );
};

const StepProgress = ({ status }: { status: MigrationStatus }) => {
  const steps = [
    { key: 'pending_burn', label: 'Burn Tokens', icon: Flame },
    { key: 'vesting_started', label: 'Create Vesting', icon: ArrowRightLeft },
  ];

  const getStepStatus = (stepKey: string) => {
    switch (stepKey) {
      case 'pending_burn':
        if (status === 'pending_burn') return 'processing';
        if (['burn_confirmed', 'vesting_started', 'completed'].includes(status)) return 'completed';
        if (status === 'error') return 'error';
        return 'pending';
      case 'vesting_started':
        if (status === 'vesting_started') return 'processing';
        if (status === 'completed') return 'completed';
        if (status === 'error' && ['burn_confirmed', 'vesting_started'].includes(status)) return 'error';
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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              stepStatus === 'completed' ? 'bg-success text-success-foreground' :
              stepStatus === 'processing' ? 'bg-primary text-primary-foreground' :
              stepStatus === 'error' ? 'bg-destructive text-destructive-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
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
                    <span className="text-sm text-primary">Processing</span>
                  )}
                  {stepStatus === 'completed' && (
                    <span className="text-sm text-success">Completed</span>
                  )}
                  {stepStatus === 'error' && (
                    <span className="text-sm text-destructive">Failed</span>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-6 ml-4 mt-2 ${
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

export const BridgeStatus = ({ 
  status, 
  transactionData, 
  vestingData, 
  statusMessage, 
  isPolling,
  vestingProgress,
  vestedAmount,
  remainingAmount,
  daysRemaining
}: BridgeStatusProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ArrowRightLeft className="w-8 h-8 text-secondary" />
          <CardTitle className="text-2xl font-bold">
            Migration in Progress
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <StatusIndicator 
            status={status} 
            statusMessage={statusMessage}
            isPolling={isPolling}
          />
        </div>

        {transactionData && (
          <div className="bg-accent/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-accent-foreground">Transaction Details</h3>
            <div className="space-y-2 text-sm">
              {transactionData.hash && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Transaction:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(transactionData.explorerUrl || getExplorerUrl(transactionData.hash, 'base'), '_blank')}
                    className="h-6 px-2 text-xs"
                  >
                    <span className="font-mono text-xs">
                      {transactionData.hash.slice(0, 8)}...{transactionData.hash.slice(-6)}
                    </span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
              {transactionData.status && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="capitalize">{transactionData.status}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {vestingData && (
          <div className="bg-accent/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-accent-foreground">Vesting Details</h3>
            <div className="space-y-2 text-sm">
              {vestingData.contractAddress && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Contract:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getExplorerUrl(vestingData.contractAddress, 'solana'), '_blank')}
                    className="h-6 px-2 text-xs"
                  >
                    <span className="font-mono text-xs">
                      {vestingData.contractAddress.slice(0, 8)}...{vestingData.contractAddress.slice(-6)}
                    </span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
              {vestingData.totalAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-mono">{vestingData.totalAmount}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vesting Progress Display */}
        {(status === 'vesting_started' || status === 'completed') && vestingProgress !== null && (
          <div className="bg-accent/50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-accent-foreground">Vesting Progress</h3>
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{(vestingProgress * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${vestingProgress * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Progress Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {vestedAmount && (
                  <div>
                    <span className="text-muted-foreground block">Vested Amount</span>
                    <span className="font-mono font-medium">{vestedAmount}</span>
                  </div>
                )}
                {remainingAmount && (
                  <div>
                    <span className="text-muted-foreground block">Remaining</span>
                    <span className="font-mono font-medium">{remainingAmount}</span>
                  </div>
                )}
              </div>
              
              {daysRemaining !== null && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Days Remaining: </span>
                  <span className="font-medium">{daysRemaining}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <StepProgress status={status} />

        {isPolling && (
          <div className="text-center text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            Tracking migration progress...
          </div>
        )}
      </CardContent>
    </Card>
  );
};