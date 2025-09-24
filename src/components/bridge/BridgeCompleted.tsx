import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BridgeFormData, TransactionData, VestingData, POPULAR_TOKENS, CONFIG } from '@/types/bridge';
import { CheckCircle, ExternalLink, Calendar, Clock, Coins, RotateCcw } from 'lucide-react';
import { getExplorerUrl } from '@/services/bridgeApi';
import { formatTokenAmount, getTokenDecimals } from '@/lib/utils';

interface BridgeCompletedProps {
  formData: BridgeFormData;
  transactionData: TransactionData;
  vestingData?: VestingData;
  onNewBridge: () => void;
}

export const BridgeCompleted = ({
  formData,
  transactionData,
  vestingData,
  onNewBridge
}: BridgeCompletedProps) => {
  const tokenSymbol = formData.tokenAddress.toLowerCase() === POPULAR_TOKENS.PENGU.toLowerCase() ? 'PENGU' : 'TOKEN';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="bridge-card w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="w-10 h-10 text-success animate-pulse" />
        </div>
        <CardTitle className="text-3xl font-bold text-success">
          Bridge Completed Successfully!
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Transaction Details Section */}
        <div className="bg-accent/30 rounded-lg p-6 border border-success/20">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Transaction Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground block">Token</span>
                <span className="font-mono font-semibold text-lg">{tokenSymbol}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Burn Amount</span>
                <span className="font-mono font-semibold">
                  {formatTokenAmount(formData.amount, getTokenDecimals(formData.tokenAddress))} {tokenSymbol}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground block">Status</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="font-semibold text-success">Completed</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block">Burn Transaction</span>
                {transactionData.hash === 'pending-verification' ? (
                  <div className="mt-1">
                    <div className="text-xs text-warning-foreground mb-1">Transaction completed - verification needed</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(CONFIG.baseExplorerUrl, '_blank')}
                      className="h-8 px-3 text-xs"
                    >
                      Check on Basescan
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getExplorerUrl(transactionData.hash, 'base'), '_blank')}
                    className="h-8 px-3 text-xs mt-1"
                  >
                    <span className="font-mono">
                      {transactionData.hash.slice(0, 8)}...{transactionData.hash.slice(-6)}
                    </span>
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Solana Vesting</span>
          </div>
        </div>

        {/* Vesting Information Section */}
        {vestingData ? (
          <div className="bg-secondary/10 rounded-lg p-6 border border-secondary/20">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold">Vesting Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground block">Vesting Contract</span>
                  <span className="font-mono text-xs break-all">
                    {vestingData.contractAddress}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Duration</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span className="font-semibold">{vestingData.duration} days</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-muted-foreground block">Start Date</span>
                  <span className="font-semibold">{formatDate(vestingData.startDate)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">End Date</span>
                  <span className="font-semibold">{formatDate(vestingData.endDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-secondary/20">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="font-semibold">Solana Devnet</span>
              </div>
            </div>

            {vestingData.explorerUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(vestingData.explorerUrl, '_blank')}
                className="w-full mt-4 border-secondary/30 hover:bg-secondary/10"
              >
                View on Solana Explorer
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Vesting Setup Pending</h3>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Your tokens have been successfully burned! The vesting setup on Solana devnet is currently being processed. 
              You will receive a notification once the vesting contract is deployed.
            </p>
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded border border-yellow-200 dark:border-yellow-700">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                <strong>Note:</strong> Our team is actively working on Solana devnet integration. 
                The burn transaction is complete and verified on Base network.
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={onNewBridge}
          className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start New Bridge
        </Button>
      </CardContent>
    </Card>
  );
};