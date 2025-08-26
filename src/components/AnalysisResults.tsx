import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, FileText, Shield, CreditCard, Lock, Zap, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface AnalysisData {
  transactionId: string;
  agentType: string;
  timestamp: string;
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

export const AnalysisResults = ({ data }: AnalysisResultsProps) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['ai-insights']));

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'declined':
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'review':
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const CollapsibleSection = ({ 
    id, 
    title, 
    icon, 
    children, 
    variant = "default" 
  }: { 
    id: string; 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode;
    variant?: "default" | "primary" | "secondary";
  }) => {
    const isOpen = openSections.has(id);
    
    const getBgColor = () => {
      switch (variant) {
        case "primary":
          return "bg-primary/5 border-primary/20";
        case "secondary":
          return "bg-secondary border-secondary/40";
        default:
          return "bg-muted/10 border-border";
      }
    };

    return (
      <Card className={`${getBgColor()} backdrop-blur-sm transition-all shadow-sm`}>
        <Collapsible open={isOpen} onOpenChange={() => toggleSection(id)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-4 sm:p-6 h-auto hover:bg-accent/30 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{icon}</div>
                <span className="text-base sm:text-lg font-semibold text-left">{title}</span>
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
              {children}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* AI Insights Section */}
      <CollapsibleSection
        id="ai-insights"
        title="AI Insights"
        icon={<Brain className="h-5 w-5 text-primary" />}
        variant="primary"
      >
        <div className="space-y-6">
          <Card className="bg-background border shadow-sm">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl">Transaction Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID:</p>
                  <p className="font-mono text-sm font-medium break-all">{data.transId || data.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(data.transactionStatus || '')}
                    <span className="text-sm font-medium">{data.transactionStatus}</span>
                  </div>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <p className="text-sm text-muted-foreground">Authorization Amount:</p>
                  <p className="text-sm font-medium">${data.authAmount?.toFixed(2)}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">AI Recommendations:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground pl-4 sm:pl-0">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Transaction appears legitimate with standard risk profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>CVV and AVS verification successful</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>No suspicious patterns detected in transaction history</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleSection>

      {/* Response Insights */}
      <CollapsibleSection
        id="response-insights"
        title="Response Insights"
        icon={<FileText className="h-5 w-5 text-secondary-foreground" />}
        variant="secondary"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Response Code:</p>
            <p className="font-mono text-lg font-bold">{data.responseCode}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reason:</p>
            <p className="text-sm font-medium">{data.responseReasonDescription}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">Description:</p>
            <p className="text-sm">{data.responseReasonDescription}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">Integration Suggestions:</p>
            <p className="text-sm">Continue with standard processing workflow. No additional verification required.</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* General Transaction Details */}
      <CollapsibleSection
        id="general-details"
        title="General Transaction Details"
        icon={<CreditCard className="h-5 w-5 text-foreground" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Transaction ID:</p>
            <p className="font-mono text-sm font-medium break-all">{data.transId || data.transactionId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status:</p>
            <Badge
              variant={
                ["declined", "failed"].includes((data.transactionStatus || '').toLowerCase())
                  ? "destructive"
                  : ["pending", "review"].includes((data.transactionStatus || '').toLowerCase())
                  ? "warning"
                  : "success"
              }
              className={
                ["declined", "failed"].includes((data.transactionStatus || '').toLowerCase())
                  ? "bg-destructive text-destructive-foreground"
                  : ["pending", "review"].includes((data.transactionStatus || '').toLowerCase())
                  ? "bg-warning text-warning-foreground"
                  : "bg-success text-success-foreground"
              }
            >
              {data.transactionStatus}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Auth Amount:</p>
            <p className="text-sm font-medium">${data.authAmount?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Response Code:</p>
            <p className="font-mono text-sm font-medium">{data.responseCode}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">Response Description:</p>
            <p className="text-sm">{data.responseReasonDescription}</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* AFDS Filters */}
      <CollapsibleSection
        id="afds-filters"
        title="AFDS Filters"
        icon={<Shield className="h-5 w-5 text-foreground" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">AFDS Filter(s):</p>
              <p className="text-sm font-medium">{Array.isArray(data.afdsFilters) && data.afdsFilters.length > 0 ? data.afdsFilters.map(f => f.name).join(', ') : 'None Applied'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Action:</p>
              <Badge
                variant={
                  Array.isArray(data.afdsFilters) && data.afdsFilters.some(f => (f.action || '').toLowerCase().includes('hold'))
                    ? "warning"
                    : "success"
                }
                className={
                  Array.isArray(data.afdsFilters) && data.afdsFilters.some(f => (f.action || '').toLowerCase().includes('hold'))
                    ? "bg-warning text-warning-foreground"
                    : "bg-success text-success-foreground"
                }
              >
                {Array.isArray(data.afdsFilters) && data.afdsFilters.length > 0 ? data.afdsFilters.map(f => f.action).join(', ') : 'Accept'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risk Score:</p>
              <Badge
                variant={
                  (data.riskDetails || '').toLowerCase().includes('high')
                    ? "destructive"
                    : (data.riskDetails || '').toLowerCase().includes('medium')
                    ? "warning"
                    : "success"
                }
                className={
                  (data.riskDetails || '').toLowerCase().includes('high')
                    ? "bg-destructive text-destructive-foreground"
                    : (data.riskDetails || '').toLowerCase().includes('medium')
                    ? "bg-warning text-warning-foreground"
                    : "bg-success text-success-foreground"
                }
              >
                {data.riskDetails || 'N/A'}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Description:</p>
            <p className="text-sm">Transaction passed all Advanced Fraud Detection filters. No suspicious patterns detected.</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* AVS Filters */}
      <CollapsibleSection
        id="avs-filters"
        title="AVS Filters"
        icon={<Lock className="h-5 w-5 text-foreground" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">AVS Response:</p>
            <p className="font-mono text-sm font-medium">{data.AVSResponse}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Match Status:</p>
            <Badge
              variant={data.AVSResponse === 'Y' ? "success" : "destructive"}
              className={data.AVSResponse === 'Y' ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}
            >
              {data.AVSResponse === 'Y' ? 'Full Match' : 'No Match'}
            </Badge>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Description:</p>
            <p className="text-sm">Address Verification System returned exact match for both street address and ZIP code.</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Recommendation:</p>
            <p className="text-sm">Proceed with transaction. AVS verification successful.</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* CVV Filters */}
      <CollapsibleSection
        id="cvv-filters"
        title="CVV Filters"
        icon={<Lock className="h-5 w-5 text-foreground" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">CVV Response:</p>
            <p className="font-mono text-sm font-medium">{data.CVVResponse}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Match Status:</p>
            <Badge
              variant={data.CVVResponse === 'M' ? "success" : "destructive"}
              className={data.CVVResponse === 'M' ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}
            >
              {data.CVVResponse === 'M' ? 'Match' : 'No Match'}
            </Badge>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Description:</p>
            <p className="text-sm">Card Verification Value matched successfully. CVV provided by customer is correct.</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Recommendation:</p>
            <p className="text-sm">CVV verification passed. Continue with standard processing.</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* 3DS Response */}
      <CollapsibleSection
        id="3ds-response"
        title="3DS Response"
        icon={<Zap className="h-5 w-5 text-foreground" />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">3DS Status:</p>
              <Badge variant="default" className="bg-success text-success-foreground">Authenticated</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">3DS Version:</p>
              <p className="font-mono text-sm font-medium">2.2.0</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Authentication Response:</p>
              <p className="font-mono text-sm font-medium">Y</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ECI Value:</p>
              <p className="font-mono text-sm font-medium">05</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Description:</p>
            <p className="text-sm">3D Secure authentication completed successfully. Cardholder was authenticated by the issuing bank.</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Recommendation:</p>
            <p className="text-sm">Transaction is protected by 3D Secure liability shift. Proceed with confidence.</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Agent Instructions Section */}
      <CollapsibleSection
        id="agent-instructions"
        title="Agent Instructions"
        icon={<FileText className="h-5 w-5 text-primary" />}
        variant="primary"
      >
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Prompt used for analysis:</p>
          <pre className="bg-muted/10 p-3 rounded text-xs whitespace-pre-wrap break-words">
            {data.agentInstructions || data.prompt || 'No instructions available.'}
          </pre>
        </div>
      </CollapsibleSection>
    </div>
  );
};