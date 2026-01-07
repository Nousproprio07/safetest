import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings,
  Shield,
  Bell,
  Users,
  Save,
} from "lucide-react";

interface OwnerSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OwnerSettings {
  allowConciergeReporting: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const defaultSettings: OwnerSettings = {
  allowConciergeReporting: false,
  emailNotifications: true,
  smsNotifications: false,
};

const getOwnerSettings = (): OwnerSettings => {
  const stored = localStorage.getItem("safeverify_owner_settings");
  return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
};

const saveOwnerSettings = (settings: OwnerSettings) => {
  localStorage.setItem("safeverify_owner_settings", JSON.stringify(settings));
};

const OwnerSettingsDialog = ({
  open,
  onOpenChange,
}: OwnerSettingsDialogProps) => {
  const [settings, setSettings] = useState<OwnerSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (open) {
      setSettings(getOwnerSettings());
      setHasChanges(false);
    }
  }, [open]);

  const handleSettingChange = (key: keyof OwnerSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveOwnerSettings(settings);
    setHasChanges(false);
    toast.success("Paramètres enregistrés", {
      description: "Vos préférences ont été mises à jour avec succès.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Paramètres
          </DialogTitle>
          <DialogDescription>
            Gérez vos préférences et autorisations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Notification preferences */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Notifications</h3>
            </div>
            
            <div className="space-y-3 pl-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("emailNotifications", checked === true)
                  }
                />
                <Label htmlFor="emailNotifications" className="text-sm cursor-pointer">
                  Recevoir des notifications par email
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("smsNotifications", checked === true)
                  }
                />
                <Label htmlFor="smsNotifications" className="text-sm cursor-pointer">
                  Recevoir des notifications par SMS
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Security info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Sécurité</h3>
            </div>
            
            <div className="pl-6">
              <p className="text-xs text-muted-foreground">
                Vos données sont protégées et chiffrées. Les signalements de fraude
                sont traités de manière confidentielle par notre équipe support.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerSettingsDialog;

// Export helper to get settings from outside
export const getOwnerSettingsExternal = (): OwnerSettings => {
  const stored = localStorage.getItem("safeverify_owner_settings");
  return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
};
