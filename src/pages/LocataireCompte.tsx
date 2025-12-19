import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle2, 
  Calendar,
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  Trash2,
  User
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Mock verifications data
const mockVerifications = [
  {
    id: "v1",
    propertyName: "Studio Marais",
    propertyLocation: "Paris, France",
    ownerName: "Jean Dupont",
    checkIn: "2024-01-15",
    checkOut: "2024-01-20",
    status: "verified" as const,
    verifiedAt: "2024-01-14",
  },
  {
    id: "v2",
    propertyName: "Appartement Bastille",
    propertyLocation: "Paris, France",
    ownerName: "Marie Martin",
    checkIn: "2024-02-10",
    checkOut: "2024-02-15",
    status: "verified" as const,
    verifiedAt: "2024-02-09",
  },
  {
    id: "v3",
    propertyName: "Villa Cannes",
    propertyLocation: "Cannes, France",
    ownerName: "Pierre Bernard",
    checkIn: "2024-03-01",
    checkOut: "2024-03-08",
    status: "pending" as const,
    verifiedAt: null,
  },
];

const LocataireCompte = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteData = () => {
    toast({
      title: "Demande envoyée",
      description: "Vos données seront supprimées sous 30 jours.",
    });
  };

  const statusConfig = {
    verified: { color: "text-green-600", bg: "bg-green-100", label: "Vérifié" },
    pending: { color: "text-yellow-600", bg: "bg-yellow-100", label: "En attente" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold">SafeVerify</span>
            <Badge variant="secondary" className="ml-2 text-xs">Voyageur</Badge>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border bg-card px-4 py-3 space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
              <Link to="/">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Link>
            </Button>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Welcome section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Mon espace voyageur</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Consultez vos vérifications et gérez vos données personnelles
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Verifications list */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Mes vérifications
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Historique de vos vérifications d'identité
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="space-y-3">
                  {mockVerifications.map((verification) => {
                    const config = statusConfig[verification.status];
                    return (
                      <div
                        key={verification.id}
                        className="p-4 rounded-lg border border-border hover:shadow-sm transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                              <Home className={`h-5 w-5 ${config.color}`} />
                            </div>
                            <div>
                              <div className="font-medium">{verification.propertyName}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {verification.propertyLocation}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                <Calendar className="h-3 w-3" />
                                <span>{verification.checkIn} → {verification.checkOut}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <User className="h-3 w-3" />
                                <span>Propriétaire: {verification.ownerName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`${config.bg} ${config.color} border-0`}>
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Profile info */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Mon profil</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium">john.smith@email.com</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Téléphone</div>
                  <div className="text-sm font-medium">+33 6 12 34 56 78</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">KYC</div>
                  <Badge variant="default" className="bg-green-100 text-green-700 border-0 mt-1">
                    Vérifié
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Modifier mes coordonnées
                </Button>
              </CardContent>
            </Card>

            {/* Data management */}
            <Card className="border-red-200">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg text-red-700">Gestion des données</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Vos droits sur vos données personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mes données
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer vos données ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos vérifications et données personnelles seront supprimées définitivement.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteData} className="bg-red-600 hover:bg-red-700">
                        Confirmer la suppression
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <p className="text-xs text-muted-foreground mt-3">
                  Conformément au RGPD, vous pouvez demander la suppression de vos données à tout moment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocataireCompte;
