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
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-muted/30 to-accent/10 border border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-6 h-auto hover:bg-accent/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">Example Transactions</span>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-6">
            <div className="space-y-3">
              {exampleTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm rounded-lg border border-border/30 hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => onSelectExample(transaction.id)}
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <span className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {transaction.id}
                      </span>
                      <span className="ml-3 text-muted-foreground">
                        - {transaction.description}
                      </span>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(transaction.status)} className="capitalize">
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