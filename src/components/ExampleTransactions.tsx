import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, FileText, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ExampleTransaction {
  id: string;
  status: 'successful' | 'fraud' | 'declined';
  description: string;
}

interface ExampleTransactionsProps {
  onSelectExample: (transactionId: string) => void;
}

const exampleTransactions: ExampleTransaction[] = [
  {
    id: "80033448364",
    status: "successful",
    description: "Successful Transaction"
  },
  {
    id: "80031664953",
    status: "fraud",
    description: "Fraud Review Transaction"
  },
  {
    id: "80031664954",
    status: "declined",
    description: "Declined Transaction"
  },
  {
    id: "80033448365",
    status: "successful",
    description: "E-commerce Purchase"
  },
  {
    id: "80031664955",
    status: "fraud",
    description: "Suspicious Activity Detected"
  }
];

export const ExampleTransactions = ({ onSelectExample }: ExampleTransactionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'fraud':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'successful':
        return 'default';
      case 'fraud':
        return 'secondary';
      case 'declined':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card border shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 sm:p-6 h-auto hover:bg-accent/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-base sm:text-lg font-semibold">Example Transactions</span>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-6 px-4 sm:px-6">
            <div className="space-y-3">
              {exampleTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background rounded-lg border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group"
                  onClick={() => onSelectExample(transaction.id)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-0">
                    {getStatusIcon(transaction.status)}
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {transaction.id}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {transaction.description}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={getStatusVariant(transaction.status)} 
                    className="capitalize self-start sm:self-center flex-shrink-0"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};