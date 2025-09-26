import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MigrationTransactionData,
  MigrationVestingData,
  CONFIG
} from '@/types/bridge';
import { CheckCircle, ExternalLink, Calendar, Clock, Coins, RotateCcw, TrendingUp, Info } from 'lucide-react';
import { getExplorerUrl } from '@/services/bridgeApi';

interface BridgeCompletedProps {
  transactionData?: MigrationTransactionData | null;
  vestingData?: MigrationVestingData | null;
  onReset: () => void;
}

export const BridgeCompleted = ({
  transactionData,
  vestingData,
  onReset
}: BridgeCompletedProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-8 h-8 text-success" />
          <CardTitle className="text-2xl font-bold text-success">
            Migration Completed!
          </CardTitle>
        </div>
        <p className="text-muted-foreground">
          Your tokens have been successfully migrated and vesting has been set up on Solana.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Transaction Summary */}
        {transactionData && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-success flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Burn Transaction Completed
            </h3>
            <div className="space-y-2 text-sm">
              {transactionData.hash && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Transaction Hash:</span>
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
              {transactionData.blockNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block Number:</span>
                  <span className="font-mono">{transactionData.blockNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-success font-medium">Confirmed</span>
              </div>
            </div>
          </div>
        )}

        {/* Vesting Details */}
        {vestingData && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-secondary flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Vesting Contract Details
            </h3>
            <div className="space-y-3">
              {vestingData.contractAddress && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Contract Address:</span>
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
              
              {vestingData.amount && (
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Total Amount:</span>
                   <span className="font-mono">{vestingData.amount}</span>
                 </div>
               )}

               {vestingData.startDate && (
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Vesting Start:</span>
                   <span>{formatDate(vestingData.startDate)}</span>
                 </div>
               )}

               {vestingData.endDate && (
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Vesting End:</span>
                   <span>{formatDate(vestingData.endDate)}</span>
                 </div>
               )}

               {vestingData.duration && (
                 <div className="flex justify-between">
                   <span className="text-muted-foreground">Vesting Duration:</span>
                   <span className="font-mono">{vestingData.duration} days</span>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-accent/50 rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-accent-foreground flex items-center gap-2">
            <Info className="w-4 h-4" />
            What's Next?
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Your tokens are now vesting on Solana {CONFIG.solanaNetwork}</p>
            <p>• You can claim vested tokens as they become available</p>
            <p>• Check your vesting contract for claim schedules</p>
            <p>• Keep your transaction records for future reference</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onReset}
            variant="outline"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Migration
          </Button>
          
          {vestingData?.contractAddress && (
            <Button
              onClick={() => window.open(getExplorerUrl(vestingData.contractAddress, 'solana'), '_blank')}
              className="flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Vesting Contract
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};