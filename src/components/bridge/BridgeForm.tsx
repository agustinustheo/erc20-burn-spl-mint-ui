import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BridgeFormData, POPULAR_TOKENS, CONFIG } from '@/types/bridge';
import { Flame, ArrowRight } from 'lucide-react';

const bridgeSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  tokenAddress: z.string()
    .min(1, 'Token address is required')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format'),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
  solanaWalletAddress: z.string()
    .min(1, 'Solana wallet address is required')
    .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana address format'),
  vestingDurationDays: z.number()
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration cannot exceed 365 days'),
});

interface BridgeFormProps {
  onSubmit: (data: BridgeFormData) => void;
  loading?: boolean;
}

export const BridgeForm = ({ onSubmit, loading = false }: BridgeFormProps) => {
  const form = useForm<BridgeFormData>({
    resolver: zodResolver(bridgeSchema),
    defaultValues: {
      accountId: '',
      tokenAddress: '',
      amount: '',
      solanaWalletAddress: '',
      vestingDurationDays: CONFIG.defaultVestingDuration,
    },
  });

  const handleTokenSuggestion = (address: string) => {
    form.setValue('tokenAddress', address);
  };

  return (
    <Card className="bridge-card w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-8 h-8 text-primary animate-pulse-glow" />
          <CardTitle className="text-3xl font-bold text-gradient">
            Token Bridge & Vest
          </CardTitle>
        </div>
        <CardDescription className="text-lg text-muted-foreground">
          Bridge ERC20 tokens from Base to Solana with automatic vesting
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Account ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your account identifier"
                      className="bg-input border-border focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tokenAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Token Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x... (ERC20 token contract address)"
                      className="bg-input border-border focus:ring-primary font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTokenSuggestion(POPULAR_TOKENS.PENGU)}
                      className="text-xs"
                    >
                      PENGU
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTokenSuggestion(POPULAR_TOKENS.AIKA)}
                      className="text-xs"
                      disabled
                    >
                      AIKA (Soon)
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Token Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1000000"
                      type="number"
                      step="any"
                      className="bg-input border-border focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="solanaWalletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Solana Wallet Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Solana wallet address for vesting contract"
                      className="bg-input border-border focus:ring-primary font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vestingDurationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Vesting Duration (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      className="bg-input border-border focus:ring-primary"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || CONFIG.defaultVestingDuration)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300 border-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Start Bridge Process
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};