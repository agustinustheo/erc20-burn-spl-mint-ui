import { TokenBridge } from '@/components/bridge/TokenBridge';
import { AuthInput } from '@/components/auth/AuthInput';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-2xl">
        <AuthInput />
        <TokenBridge />
      </div>
    </div>
  );
};

export default Index;
