import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, LogOut } from 'lucide-react';

export const AuthInput = () => {
  const { authToken, setAuthToken, clearAuthToken, isAuthenticated } = useAuth();
  const [inputToken, setInputToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputToken.trim()) {
      setAuthToken(inputToken.trim());
      setInputToken('');
    }
  };

  if (isAuthenticated) {
    return (
      <Alert className="mb-4">
        <Lock className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Authentication active</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAuthToken}
            className="ml-2"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Clear Token
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Authentication Required
        </CardTitle>
        <CardDescription>
          Enter your Bearer Token to use the API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bearer-token">Bearer Token</Label>
            <div className="flex gap-2">
              <Input
                id="bearer-token"
                type={showToken ? 'text' : 'password'}
                placeholder="eyJhbGcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? 'Hide' : 'Show'}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={!inputToken.trim()}>
            Authenticate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
