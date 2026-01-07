import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Users, ExternalLink, Home } from "lucide-react";
import { toast } from "sonner";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
}

interface ConciergerieConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: Property[];
  ownerCode: string;
}

const ConciergerieConfigDialog = ({
  open,
  onOpenChange,
  properties,
  ownerCode,
}: ConciergerieConfigDialogProps) => {
  const [copied, setCopied] = useState(false);

  // Generate unique conciergerie access link
  const conciergerieLink = `https://safeverify.com/conciergerie/access/${ownerCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(conciergerieLink);
    setCopied(true);
    toast.success("Lien copié dans le presse-papiers", {
      description: "Partagez ce lien avec votre conciergerie pour lui donner accès à vos biens.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Configurer ma conciergerie
          </DialogTitle>
          <DialogDescription>
            Partagez ce lien avec votre conciergerie pour lui permettre d'accéder à vos biens.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Access link section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Lien d'accès conciergerie</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-xs break-all">
                {conciergerieLink}
              </div>
              <Button
                size="sm"
                variant={copied ? "default" : "outline"}
                onClick={copyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ce lien permet à votre conciergerie de voir et gérer les vérifications de vos biens.
            </p>
          </div>

          {/* Properties that will be accessible */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              Biens accessibles ({properties.length})
            </label>
            {properties.length === 0 ? (
              <p className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                Aucun bien enregistré. Créez vos biens pour les partager avec votre conciergerie.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{property.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {property.city}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Partagé
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Note :</strong> Votre conciergerie pourra voir les informations de vos biens et signaler des fraudes si vous avez activé cette permission.
            </p>
          </div>

          <Button className="w-full" onClick={copyLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copier le lien d'accès
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConciergerieConfigDialog;
