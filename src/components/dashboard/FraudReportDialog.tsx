import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  CreditCard,
  Globe,
  User,
  Calendar,
  Euro,
  Upload,
  FileText,
  Check,
  Loader2,
  X,
  Shield,
  Info,
} from "lucide-react";

interface FraudReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allVerified: boolean;
  hasActivePack: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "completed" | "error";
  errorMessage?: string;
}

// Dangerous file extensions to reject
const DANGEROUS_EXTENSIONS = [".exe", ".bat", ".cmd", ".msi", ".scr", ".pif", ".com", ".vbs", ".js", ".jar"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 20;

const FraudReportDialog = ({
  open,
  onOpenChange,
  allVerified,
  hasActivePack,
}: FraudReportDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [duplicateReference, setDuplicateReference] = useState<string | null>(null);

  // Step 1: Suspect identification
  const [suspectEmail, setSuspectEmail] = useState("");
  const [suspectPhone, setSuspectPhone] = useState("");
  const [suspectIban, setSuspectIban] = useState("");
  const [suspectPlatform, setSuspectPlatform] = useState("");
  const [suspectName, setSuspectName] = useState("");

  // Step 2: Transaction context
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionCurrency, setTransactionCurrency] = useState("EUR");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [adUrl, setAdUrl] = useState("");

  // Step 3: Evidence files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Step 4: Legal validation
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);

  const canProceedStep1 =
    suspectEmail || suspectPhone || suspectIban || suspectPlatform || suspectName;
  const canProceedStep4 = consent1 && consent2 && consent3;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const remainingSlots = MAX_FILES - uploadedFiles.length;
    if (remainingSlots <= 0) {
      toast.error("Maximum 20 fichiers autorisés");
      return;
    }

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      // Check for dangerous extensions
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      if (DANGEROUS_EXTENSIONS.includes(extension)) {
        toast.error(`Fichier rejeté: ${file.name}`, {
          description: "Type de fichier non autorisé pour des raisons de sécurité",
        });
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Fichier trop volumineux: ${file.name}`, {
          description: "La taille maximale est de 10 Mo par fichier",
        });
        return;
      }

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading",
      };

      setUploadedFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, progress: 100, status: "completed" } : f
            )
          );
        } else {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === newFile.id ? { ...f, progress } : f))
          );
        }
      }, 200);
    });

    // Reset input
    event.target.value = "";
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
    return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate 10% chance of duplicate
    if (Math.random() < 0.1) {
      setDuplicateReference("#SF-2024-00847");
      setIsSubmitting(false);
      return;
    }

    // Generate reference number
    const ref = `#SF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`;
    setReferenceNumber(ref);
    setIsSubmitting(false);

    // Save to localStorage
    const reports = JSON.parse(localStorage.getItem("safeverify_manual_fraud_reports") || "[]");
    reports.push({
      reference: ref,
      suspectEmail,
      suspectPhone,
      suspectIban,
      suspectPlatform,
      suspectName,
      transactionDate,
      transactionAmount,
      transactionCurrency,
      paymentMethod,
      adUrl,
      filesCount: uploadedFiles.length,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("safeverify_manual_fraud_reports", JSON.stringify(reports));
  };

  const handleClose = () => {
    // Reset all state
    setCurrentStep(1);
    setIsSubmitting(false);
    setReferenceNumber(null);
    setDuplicateReference(null);
    setSuspectEmail("");
    setSuspectPhone("");
    setSuspectIban("");
    setSuspectPlatform("");
    setSuspectName("");
    setTransactionDate("");
    setTransactionAmount("");
    setTransactionCurrency("EUR");
    setPaymentMethod("");
    setAdUrl("");
    setUploadedFiles([]);
    setConsent1(false);
    setConsent2(false);
    setConsent3(false);
    onOpenChange(false);
  };

  // Check prerequisites
  if (!allVerified || !hasActivePack) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Pré-requis non remplis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Pour signaler une fraude, vous devez :
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                {allVerified ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                Avoir complété les vérifications A à E
              </li>
              <li className="flex items-center gap-2">
                {hasActivePack ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                Avoir un abonnement actif
              </li>
            </ul>
          </div>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Success state
  if (referenceNumber) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Signalement envoyé</h2>
            <p className="text-muted-foreground mb-4">
              Votre signalement a été transmis à notre équipe.
            </p>
            <div className="p-4 bg-muted rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-1">Référence :</p>
              <p className="text-lg font-mono font-bold">{referenceNumber}</p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Duplicate state
  if (duplicateReference) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Signalement similaire détecté
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Un signalement similaire existe déjà avec la référence :
            </p>
            <div className="p-4 bg-muted rounded-lg mb-6">
              <p className="text-lg font-mono font-bold text-center">{duplicateReference}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => {
              setDuplicateReference(null);
              toast.info("Signalement envoyé en complément");
              handleSubmit();
            }}>
              Envoyer comme complément
            </Button>
            <Button variant="ghost" onClick={handleClose}>
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Signaler une fraude
          </DialogTitle>
          <DialogDescription>
            Étape {currentStep} sur 4
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="mb-6">
          <Progress value={(currentStep / 4) * 100} className="h-2" />
          <div className="flex justify-between mt-2">
            {["Identification", "Transaction", "Preuves", "Validation"].map((label, idx) => (
              <span
                key={label}
                className={`text-xs ${
                  idx + 1 <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Step 1: Suspect identification */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <strong>Au moins 1 champ obligatoire</strong> pour identifier le suspect.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={suspectEmail}
                  onChange={(e) => setSuspectEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Téléphone
                </Label>
                <Input
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={suspectPhone}
                  onChange={(e) => setSuspectPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> IBAN
                </Label>
                <Input
                  placeholder="FR76 XXXX XXXX XXXX"
                  value={suspectIban}
                  onChange={(e) => setSuspectIban(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Plateforme
                </Label>
                <Input
                  placeholder="Airbnb, Booking, Leboncoin..."
                  value={suspectPlatform}
                  onChange={(e) => setSuspectPlatform(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Nom / Pseudo
                </Label>
                <Input
                  placeholder="Nom ou pseudonyme utilisé"
                  value={suspectName}
                  onChange={(e) => setSuspectName(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Transaction context */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Date de la transaction
                </Label>
                <Input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Euro className="h-4 w-4" /> Montant
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={transactionCurrency}
                    onChange={(e) => setTransactionCurrency(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Méthode de paiement</Label>
                <Input
                  placeholder="Virement, CB, PayPal..."
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> URL de l'annonce
                </Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={adUrl}
                  onChange={(e) => setAdUrl(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Evidence */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-1">Pièces justificatives</p>
              <p className="text-muted-foreground">
                Maximum {MAX_FILES} fichiers, {MAX_FILE_SIZE / (1024 * 1024)} Mo par fichier
              </p>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">
                Glissez vos fichiers ici ou
              </p>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span className="cursor-pointer">
                    Parcourir
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                  </span>
                </Button>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Fichiers ({uploadedFiles.length}/{MAX_FILES})
                </p>
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        {file.status === "uploading" && (
                          <Progress value={file.progress} className="h-1 flex-1" />
                        )}
                        {file.status === "completed" && (
                          <Badge variant="secondary" className="text-xs">
                            <Check className="h-3 w-3 mr-1" /> Uploadé
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Legal validation */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <strong>Validation obligatoire</strong> - Veuillez cocher les 3 cases pour continuer.
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Checkbox
                  id="consent1"
                  checked={consent1}
                  onCheckedChange={(checked) => setConsent1(checked === true)}
                />
                <label htmlFor="consent1" className="text-sm leading-relaxed cursor-pointer">
                  Je certifie que les informations fournies sont exactes et de bonne foi.
                  Je comprends que toute fausse déclaration peut entraîner des poursuites.
                </label>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Checkbox
                  id="consent2"
                  checked={consent2}
                  onCheckedChange={(checked) => setConsent2(checked === true)}
                />
                <label htmlFor="consent2" className="text-sm leading-relaxed cursor-pointer">
                  J'autorise SafeVerify à traiter ces données conformément à sa politique
                  de confidentialité et à les partager avec les autorités compétentes si nécessaire.
                </label>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Checkbox
                  id="consent3"
                  checked={consent3}
                  onCheckedChange={(checked) => setConsent3(checked === true)}
                />
                <label htmlFor="consent3" className="text-sm leading-relaxed cursor-pointer">
                  Je comprends que ce signalement sera enregistré et pourra être utilisé
                  pour protéger d'autres utilisateurs de la plateforme.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleClose}>
              Annuler
            </Button>
          )}

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 1 && !canProceedStep1}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedStep4 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le signalement"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FraudReportDialog;
