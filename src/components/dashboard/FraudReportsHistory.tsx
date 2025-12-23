import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileText, 
  Calendar, 
  Euro, 
  Globe,
  ChevronRight,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye
} from "lucide-react";

interface ManualFraudReport {
  reference: string;
  suspectEmail: string;
  suspectPhone: string;
  suspectIban: string;
  suspectPlatform: string;
  suspectName: string;
  transactionDate: string;
  transactionAmount: string;
  transactionCurrency: string;
  paymentMethod: string;
  adUrl: string;
  filesCount: number;
  createdAt: string;
  status?: "pending" | "in_review" | "resolved" | "rejected";
}

interface FraudReportsHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusConfig = (status: string = "pending") => {
  const configs = {
    pending: { 
      label: "En attente", 
      variant: "secondary" as const,
      icon: Clock 
    },
    in_review: { 
      label: "En cours d'analyse", 
      variant: "default" as const,
      icon: Eye 
    },
    resolved: { 
      label: "Résolu", 
      variant: "default" as const,
      icon: CheckCircle2 
    },
    rejected: { 
      label: "Rejeté", 
      variant: "destructive" as const,
      icon: X 
    },
  };
  return configs[status as keyof typeof configs] || configs.pending;
};

const FraudReportsHistory = ({ open, onOpenChange }: FraudReportsHistoryProps) => {
  const [reports, setReports] = useState<ManualFraudReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ManualFraudReport | null>(null);

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem("safeverify_manual_fraud_reports");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Add mock status to existing reports
        const withStatus = parsed.map((r: ManualFraudReport, idx: number) => ({
          ...r,
          status: idx === 0 ? "in_review" : idx === 1 ? "resolved" : "pending"
        }));
        setReports(withStatus.reverse()); // Most recent first
      }
    }
  }, [open]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  if (selectedReport) {
    const statusConfig = getStatusConfig(selectedReport.status);
    const StatusIcon = statusConfig.icon;
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Détails du signalement
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header with reference and status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Référence</p>
                <p className="font-mono font-bold text-lg">{selectedReport.reference}</p>
              </div>
              <Badge variant={statusConfig.variant} className="flex items-center gap-1 w-fit">
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>

            {/* Creation date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Créé le {formatDate(selectedReport.createdAt)}
            </div>

            {/* Suspect info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Informations du suspect
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedReport.suspectEmail && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{selectedReport.suspectEmail}</p>
                  </div>
                )}
                {selectedReport.suspectPhone && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-medium">{selectedReport.suspectPhone}</p>
                  </div>
                )}
                {selectedReport.suspectIban && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">IBAN</p>
                    <p className="text-sm font-medium font-mono">{selectedReport.suspectIban}</p>
                  </div>
                )}
                {selectedReport.suspectPlatform && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Plateforme</p>
                    <p className="text-sm font-medium">{selectedReport.suspectPlatform}</p>
                  </div>
                )}
                {selectedReport.suspectName && (
                  <div className="p-3 bg-muted/50 rounded-lg sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Nom / Pseudo</p>
                    <p className="text-sm font-medium">{selectedReport.suspectName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction info */}
            {(selectedReport.transactionDate || selectedReport.transactionAmount || selectedReport.paymentMethod || selectedReport.adUrl) && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Euro className="h-4 w-4 text-blue-500" />
                  Contexte de la transaction
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedReport.transactionDate && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedReport.transactionDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}
                  {selectedReport.transactionAmount && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Montant</p>
                      <p className="text-sm font-medium">
                        {selectedReport.transactionAmount} {selectedReport.transactionCurrency}
                      </p>
                    </div>
                  )}
                  {selectedReport.paymentMethod && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Méthode de paiement</p>
                      <p className="text-sm font-medium">{selectedReport.paymentMethod}</p>
                    </div>
                  )}
                  {selectedReport.adUrl && (
                    <div className="p-3 bg-muted/50 rounded-lg sm:col-span-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        URL de l'annonce
                      </p>
                      <a 
                        href={selectedReport.adUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline truncate block"
                      >
                        {selectedReport.adUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Files */}
            {selectedReport.filesCount > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Pièces jointes</p>
                <p className="text-sm font-medium">{selectedReport.filesCount} fichier(s)</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedReport(null)} className="flex-1">
                Retour à la liste
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Historique des signalements
          </DialogTitle>
        </DialogHeader>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold text-lg mb-2">Aucun signalement</h3>
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas encore soumis de signalement de fraude.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Suspect</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => {
                  const statusConfig = getStatusConfig(report.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <TableRow key={report.reference} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono font-medium">
                        {report.reference}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(report.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {report.suspectName || report.suspectEmail || report.suspectPhone || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {report.transactionAmount 
                          ? `${report.transactionAmount} ${report.transactionCurrency}`
                          : "-"
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant} className="flex items-center gap-1 w-fit">
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                        >
                          Voir
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FraudReportsHistory;
