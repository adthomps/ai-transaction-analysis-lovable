import { useState } from "react";
import { TransactionSearch } from "@/components/TransactionSearch";
import { ExampleTransactions } from "@/components/ExampleTransactions";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchState, setSearchState] = useState<{
    status: 'idle' | 'searching' | 'success' | 'error';
    data: any;
    errorMessage?: string;
  }>({
    status: 'idle',
    data: null
  });

  const { toast } = useToast();

  const handleSearch = async (agentType: string, transactionId: string) => {
    setSearchState({ status: 'searching', data: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful response
      const analysisData = {
        transactionId,
        agentType,
        timestamp: new Date().toISOString()
      };

      setSearchState({
        status: 'success',
        data: analysisData
      });

      toast({
        title: "Analysis Complete",
        description: `Transaction ${transactionId} analyzed successfully with ${agentType} agent.`,
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
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Interface */}
        <TransactionSearch
          onSearch={handleSearch}
          isLoading={searchState.status === 'searching'}
          searchStatus={searchState.status}
          errorMessage={searchState.errorMessage}
        />

        {/* Example Transactions */}
        <ExampleTransactions onSelectExample={handleExampleSelect} />

        {/* Analysis Results */}
        {searchState.status === 'success' && searchState.data && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <AnalysisResults data={searchState.data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;