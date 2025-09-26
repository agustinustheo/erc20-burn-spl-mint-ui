import { TokenBridge } from '@/components/bridge/TokenBridge';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-2xl">
        <TokenBridge />
      </div>
    </div>
  );
};

export default Index;
