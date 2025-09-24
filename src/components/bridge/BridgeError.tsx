import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorDisplay } from '@/types/bridge';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface BridgeErrorProps {
  error: ErrorDisplay;
  onRetry?: () => void;
  onBack: () => void;
}

export const BridgeError = ({ error, onRetry, onBack }: BridgeErrorProps) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return '🌐';
      case 'validation':
        return '⚠️';
      case 'insufficient':
        return '💰';
      case 'transaction':
        return '🔥';
      case 'vesting':
        return '🌉';
      default:
        return '❌';
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Network Connection Failed';
      case 'validation':
        return 'Invalid Input Data';
      case 'insufficient':
        return 'Insufficient Token Balance';
      case 'transaction':
        return 'Transaction Failed';
      case 'vesting':
        return 'Vesting Creation Failed';
      default:
        return 'Bridge Failed';
    }
  };

  const getSuggestion = () => {
    switch (error.type) {
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'validation':
        return 'Please review your input data and correct any errors.';
      case 'insufficient':
        return 'Make sure you have enough tokens in your wallet.';
      case 'transaction':
        return 'The token burn transaction failed. Please try again or contact support.';
      case 'vesting':
        return 'Failed to create the Solana vesting contract. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <Card className="bridge-card w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold text-destructive">
          {getErrorTitle()}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center text-6xl mb-4">
          {getErrorIcon()}
        </div>

        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-sm">
            <div className="font-medium mb-2">{error.message}</div>
            {error.details && (
              <div className="text-muted-foreground mt-2 font-mono text-xs bg-muted/50 p-2 rounded">
                {error.details}
              </div>
            )}
          </AlertDescription>
        </Alert>

        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium mb-2 text-foreground">What can you do?</h4>
          <p className="text-sm text-muted-foreground">{getSuggestion()}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          {error.retryable && onRetry && (
            <Button
              onClick={onRetry}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          If the problem persists, please contact our support team.
        </div>
      </CardContent>
    </Card>
  );
};