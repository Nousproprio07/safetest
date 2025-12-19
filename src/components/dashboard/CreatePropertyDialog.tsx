import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Home,
  MapPin,
  Upload,
  X,
  CheckCircle2,
  Loader2,
  Shield,
  Eye,
  Link as LinkIcon,
  Copy,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  description: string;
  photos: string[];
  propertyCode: string;
  verificationLink: string;
  createdAt: Date;
}

interface CreatePropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPropertyCreated: (property: Property) => void;
}

type Step = "form" | "scanning" | "analyzing" | "generating" | "complete";

const CreatePropertyDialog = ({
  open,
  onOpenChange,
  onPropertyCreated,
}: CreatePropertyDialogProps) => {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    description: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [generatedProperty, setGeneratedProperty] = useState<Property | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photos.length > 5) {
      toast.error("Maximum 5 photos autorisées");
      return;
    }

    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotosPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotosPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const generatePropertyCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "SV-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const simulateClamAVScan = async () => {
    setStep("scanning");
    setScanProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setScanProgress(i);
    }
  };

  const simulateVisionAIAnalysis = async () => {
    setStep("analyzing");
    setAnalyzeProgress(0);
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setAnalyzeProgress(i);
    }
  };

  const simulateCodeGeneration = async () => {
    setStep("generating");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const propertyCode = generatePropertyCode();
    const property: Property = {
      id: crypto.randomUUID(),
      name: formData.name,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      description: formData.description,
      photos: photosPreviews,
      propertyCode,
      verificationLink: `https://safeverify.com/v/${propertyCode.toLowerCase()}`,
      createdAt: new Date(),
    };

    setGeneratedProperty(property);
    setStep("complete");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.city || !formData.postalCode) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (photos.length === 0) {
      toast.error("Veuillez ajouter au moins une photo");
      return;
    }

    // Start the simulation pipeline
    await simulateClamAVScan();
    await simulateVisionAIAnalysis();
    await simulateCodeGeneration();
  };

  const handleComplete = () => {
    if (generatedProperty) {
      onPropertyCreated(generatedProperty);
      toast.success("Bien créé avec succès !");
      resetForm();
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    setStep("form");
    setFormData({ name: "", address: "", city: "", postalCode: "", description: "" });
    setPhotos([]);
    setPhotosPreviews([]);
    setScanProgress(0);
    setAnalyzeProgress(0);
    setGeneratedProperty(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers");
  };

  const renderFormStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Nom du logement *</Label>
            <Input
              id="name"
              placeholder="Ex: Appartement Paris 11e"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Adresse *</Label>
            <Input
              id="address"
              placeholder="123 rue de la République"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="city">Ville *</Label>
            <Input
              id="city"
              placeholder="Paris"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="postalCode">Code postal *</Label>
            <Input
              id="postalCode"
              placeholder="75011"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre logement..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        {/* Photo upload */}
        <div>
          <Label>Photos du logement * (max 5)</Label>
          <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Glissez vos photos ici ou
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Parcourir
            </Button>
          </div>

          {/* Photo previews */}
          {photosPreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
              {photosPreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={preview}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Annuler
        </Button>
        <Button type="submit">
          Créer le bien
        </Button>
      </div>
    </form>
  );

  const renderScanningStep = () => (
    <div className="py-8 text-center space-y-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Shield className="h-10 w-10 text-blue-600 animate-pulse" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Scan antivirus ClamAV</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Analyse de sécurité des fichiers en cours...
        </p>
      </div>
      <div className="max-w-xs mx-auto space-y-2">
        <Progress value={scanProgress} className="h-2" />
        <p className="text-sm text-muted-foreground">{scanProgress}%</p>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <span>Aucune menace détectée</span>
      </div>
    </div>
  );

  const renderAnalyzingStep = () => (
    <div className="py-8 text-center space-y-6">
      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
        <Eye className="h-10 w-10 text-purple-600 animate-pulse" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Analyse Vision AI</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Vérification par recherche inversée des images...
        </p>
      </div>
      <div className="max-w-xs mx-auto space-y-2">
        <Progress value={analyzeProgress} className="h-2" />
        <p className="text-sm text-muted-foreground">{analyzeProgress}%</p>
      </div>
      <div className="flex flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Photos originales confirmées</span>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Aucun duplicata trouvé</span>
        </div>
      </div>
    </div>
  );

  const renderGeneratingStep = () => (
    <div className="py-8 text-center space-y-6">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Génération en cours</h3>
        <p className="text-sm text-muted-foreground">
          Création du code logement et du lien de vérification...
        </p>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Bien créé avec succès !</h3>
        <p className="text-sm text-muted-foreground">
          Votre logement "{generatedProperty?.name}" est maintenant prêt.
        </p>
      </div>

      <div className="space-y-4 bg-muted/50 rounded-lg p-4">
        <div>
          <Label className="text-xs text-muted-foreground">Code logement fixe</Label>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-background rounded-md px-3 py-2 font-mono text-lg font-bold text-primary">
              {generatedProperty?.propertyCode}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(generatedProperty?.propertyCode || "")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Lien de vérification</Label>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-background rounded-md px-3 py-2 text-sm truncate">
              <LinkIcon className="h-4 w-4 inline mr-2 text-muted-foreground" />
              {generatedProperty?.verificationLink}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(generatedProperty?.verificationLink || "")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">
              Partagez ce lien avec vos locataires
            </p>
            <p className="text-blue-700">
              Ils pourront effectuer leur vérification d'identité via ce lien unique.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleComplete}>
          Terminer
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && step !== "form") {
        // Don't allow closing during processing
        return;
      }
      if (!isOpen) {
        resetForm();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            {step === "form" && "Créer un nouveau bien"}
            {step === "scanning" && "Sécurité des fichiers"}
            {step === "analyzing" && "Analyse des images"}
            {step === "generating" && "Finalisation"}
            {step === "complete" && "Bien créé"}
          </DialogTitle>
          {step === "form" && (
            <DialogDescription>
              Renseignez les informations de votre logement
            </DialogDescription>
          )}
        </DialogHeader>

        {step === "form" && renderFormStep()}
        {step === "scanning" && renderScanningStep()}
        {step === "analyzing" && renderAnalyzingStep()}
        {step === "generating" && renderGeneratingStep()}
        {step === "complete" && renderCompleteStep()}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertyDialog;
