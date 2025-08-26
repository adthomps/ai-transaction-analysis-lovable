
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, AlertTriangle, XCircle, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExampleTransaction {
  id: string;
  status: 'successful' | 'fraud' | 'declined';
  description: string;
  timestamp?: string;
}

interface ExampleTransactionsProps {
  onSelectExample: (transactionId: string) => void;
}

const exampleTransactions: ExampleTransaction[] = [
  {
    id: "80033448364",
    status: "successful",
    description: "Successful Transaction",
    timestamp: "2025-08-24 10:15:00"
  },
  {
    id: "80031664953",
    status: "fraud",
    description: "Fraud Review Transaction",
    timestamp: "2025-08-24 09:50:00"
  },
  {
    id: "80031664954",
    status: "declined",
    description: "Declined Transaction",
    timestamp: "2025-08-24 09:30:00"
  },
  {
    id: "80033448365",
    status: "successful",
    description: "E-commerce Purchase",
    timestamp: "2025-08-23 18:20:00"
  },
  {
    id: "80031664955",
    status: "fraud",
    description: "Suspicious Activity Detected",
    timestamp: "2025-08-23 17:45:00"
  }
];

const getStatusChip = (status: string) => {
  // All hover background color classes removed for ADA compliance
  switch (status) {
    case 'successful':
      return (
        <Badge
          variant="default"
          className="flex items-center gap-1 px-2 py-1 text-white bg-green-700 dark:bg-green-600 border border-green-800 dark:border-green-400 shadow-sm"
        >
          <CheckCircle className="h-4 w-4 mr-1" /> Success
        </Badge>
      );
    case 'fraud':
      return (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1 text-white bg-yellow-800 dark:bg-yellow-500 border border-yellow-900 dark:border-yellow-300 shadow-sm"
        >
          <AlertTriangle className="h-4 w-4 mr-1" /> Fraud
        </Badge>
      );
    case 'declined':
      return (
        <Badge
          variant="destructive"
          className="flex items-center gap-1 px-2 py-1 text-white bg-red-700 dark:bg-red-600 border border-red-800 dark:border-red-400 shadow-sm"
        >
          <XCircle className="h-4 w-4 mr-1" /> Declined
        </Badge>
      );
    default:
      return null;
  }
};

export const ExampleTransactions = ({ onSelectExample }: ExampleTransactionsProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast({ title: "Copied!", description: `Transaction ID ${id} copied to clipboard.` });
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <Card className="bg-card border shadow-md w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 cursor-pointer select-none" onClick={() => setExpanded((v) => !v)}>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold text-primary">Example Transactions</span>
        </div>
        <Button variant="ghost" size="icon" aria-label={expanded ? "Collapse" : "Expand"}>
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-2 pb-6 px-4">
          <div className="space-y-4">
            {exampleTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group flex flex-col gap-1 p-4 bg-background rounded-lg border border-border shadow-sm"
                aria-label={`Example transaction ${transaction.id}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-base font-bold select-all ${
                      transaction.status === 'successful'
                        ? 'text-green-700 dark:text-green-300'
                        : transaction.status === 'fraud'
                        ? 'text-yellow-800 dark:text-yellow-300'
                        : transaction.status === 'declined'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-primary'
                    }`}
                  >
                    {transaction.id}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Copy transaction ID ${transaction.id}`}
                    onClick={() => handleCopy(transaction.id)}
                    className={`transition-colors ${copiedId === transaction.id ? 'bg-success/20' : ''}`}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusChip(transaction.status)}
                  <span className="text-sm text-gray-700 dark:text-gray-300">{transaction.description}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
// End of ExampleTransactions component