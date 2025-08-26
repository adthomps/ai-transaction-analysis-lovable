import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Bot, Loader2, CheckCircle, XCircle } from "lucide-react";
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
    <Card className="w-full max-w-4xl mx-auto bg-card shadow-md border">
      <CardHeader className="pb-6 px-4 sm:px-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-center text-primary">
          AI Transaction Analysis Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6">

        {getStatusMessage() && (
          <div
            className={`rounded-lg px-4 py-3 flex items-center gap-3 mb-2 font-medium shadow-sm border
              ${searchStatus === 'success'
                ? 'bg-success/10 border-success'
                : searchStatus === 'error'
                ? 'bg-destructive/10 border-destructive'
                : 'bg-primary/10 border-primary'}
            `}
          >
            {searchStatus === 'success' && <CheckCircle className="h-5 w-5 text-success" />}
            {searchStatus === 'error' && <XCircle className="h-5 w-5 text-destructive" />}
            {searchStatus === 'searching' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            <span
              className={
                searchStatus === 'success'
                  ? 'text-green-700 dark:text-green-300 font-semibold'
                  : searchStatus === 'error'
                  ? 'text-red-700 dark:text-red-300 font-semibold'
                  : 'text-blue-700 dark:text-blue-300 font-semibold'
              }
            >
              {getStatusMessage()}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Select AI Agent Type:
            </label>
            <Select value={agentType} onValueChange={setAgentType}>
              <SelectTrigger className="w-full h-12 border bg-background hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary flex-shrink-0" />
                  <SelectValue placeholder="Choose analysis type..." />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-popover border z-50">
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
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="e.g., 80033448364"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="flex-1 h-12 border bg-background hover:bg-accent/30 transition-colors focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="submit"
                disabled={!agentType || !transactionId || isLoading}
                className="h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Analyzing</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    <span>Search</span>
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