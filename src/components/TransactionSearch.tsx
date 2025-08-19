import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Bot, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TransactionSearchProps {
  onSearch: (agentType: string, transactionId: string) => void;
  isLoading: boolean;
  searchStatus: 'idle' | 'searching' | 'success' | 'error';
  errorMessage?: string;
}

export const TransactionSearch = ({ onSearch, isLoading, searchStatus, errorMessage }: TransactionSearchProps) => {
  const [agentType, setAgentType] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentType && transactionId) {
      onSearch(agentType, transactionId);
    }
  };

  const getStatusMessage = () => {
    switch (searchStatus) {
      case 'searching':
        return "Analyzing transaction with AI...";
      case 'success':
        return "Transaction analysis completed successfully!";
      case 'error':
        return errorMessage || "Analysis failed. Please try again.";
      default:
        return null;
    }
  };

  const getStatusVariant = () => {
    switch (searchStatus) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card shadow-lg border">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          AI Transaction Analysis Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {getStatusMessage() && (
          <Alert variant={getStatusVariant()} className="border-l-4">
            <AlertDescription className="flex items-center gap-2">
              {searchStatus === 'searching' && <Loader2 className="h-4 w-4 animate-spin" />}
              {getStatusMessage()}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Select AI Agent Type:
            </label>
            <Select value={agentType} onValueChange={setAgentType}>
              <SelectTrigger className="w-full h-12 border bg-background">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Choose analysis type..." />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-popover border-2">
                <SelectItem value="basic">Basic Analysis</SelectItem>
                <SelectItem value="advanced">Advanced Fraud Detection</SelectItem>
                <SelectItem value="compliance">Compliance Review</SelectItem>
                <SelectItem value="risk">Risk Assessment</SelectItem>
                <SelectItem value="merchant">Merchant Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Enter Transaction ID:
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="e.g., 80033448364"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="flex-1 h-12 border bg-background"
              />
              <Button
                type="submit"
                disabled={!agentType || !transactionId || isLoading}
                className="h-12 px-8 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};