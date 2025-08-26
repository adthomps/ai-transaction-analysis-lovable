import { useState } from "react";
import { Header } from "@/components/Header";
import { TransactionSearch } from "@/components/TransactionSearch";
import { ExampleTransactions } from "@/components/ExampleTransactions";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  type AnalysisData = {
  transactionId: string;
  agentType: string;
  timestamp: string;
  prompt?: string;
  aiInsights?: string;
  [key: string]: unknown;
  };

  const [searchState, setSearchState] = useState<{
    status: 'idle' | 'searching' | 'success' | 'error';
    data: AnalysisData | null;
    errorMessage?: string;
  }>({
    status: 'idle',
    data: null
  });

  const { toast } = useToast();

  const handleSearch = async (agentType: string, transactionId: string) => {
    setSearchState({ status: 'searching', data: null });

    try {
      // Step 1: Fetch transaction details
      const res = await fetch(`/api/transaction/${transactionId}`);
      const transaction = await res.json();

      if (!res.ok || transaction.error) {
        setSearchState({
          status: 'error',
          data: null,
          errorMessage: transaction.error || 'Transaction not found.'
        });
        toast({
          title: "Analysis Failed",
          description: transaction.error || "Unable to complete transaction analysis. Please check the transaction ID and try again.",
          variant: "destructive",
        });
        return;
      }

      // Step 2: Call /api/analyze with transaction and agentType
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction, promptType: agentType })
      });
      const analysis = await analyzeRes.json();

      if (!analyzeRes.ok || analysis.error) {
        setSearchState({
          status: 'error',
          data: null,
          errorMessage: analysis.error || 'Analysis failed.'
        });
        toast({
          title: "Analysis Failed",
          description: analysis.error || "Unable to complete transaction analysis. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Prepare analysis data for AnalysisResults
      const analysisData = {
        transactionId: transaction.transId,
        agentType,
        timestamp: new Date().toISOString(),
        ...transaction,
        ...analysis // includes prompt, aiInsights, etc.
      };

      setSearchState({
        status: 'success',
        data: analysisData
      });

      toast({
        title: "Analysis Complete",
        description: `Transaction ${transaction.transId} analyzed successfully with ${agentType} agent.`,
      });

    } catch (error) {
      setSearchState({
        status: 'error',
        data: null,
        errorMessage: "Failed to analyze transaction. Please try again."
      });
      toast({
        title: "Analysis Failed",
        description: "Unable to complete transaction analysis. Please check the transaction ID and try again.",
        variant: "destructive",
      });
    }
  };

  const handleExampleSelect = (transactionId: string) => {
    // Auto-fill the search form with the selected example
    toast({
      title: "Example Selected",
      description: `Transaction ID ${transactionId} has been selected. Choose an AI agent type and click Search to analyze.`,
    });
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-8">
          <section className="space-y-8">
            {/* Search Interface */}
            <TransactionSearch
              onSearch={handleSearch}
              isLoading={searchState.status === 'searching'}
              searchStatus={searchState.status}
              errorMessage={searchState.errorMessage}
            />

            {/* Analysis Results */}
            {searchState.status === 'success' && searchState.data && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <AnalysisResults data={searchState.data} />
              </div>
            )}
          </section>
          {/* Desktop: ExampleTransactions in top-level aside landmark */}
          <aside className="hidden lg:block" aria-label="Example Transactions">
            <ExampleTransactions onSelectExample={handleExampleSelect} />
          </aside>
        </div>
        {/* Mobile: ExampleTransactions in top-level aside landmark below main content */}
        <aside className="block lg:hidden mt-8" aria-label="Example Transactions">
          <ExampleTransactions onSelectExample={handleExampleSelect} />
        </aside>
      </main>
    </div>
  );
};

export default Index;