import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Mail, 
  Phone, 
  FileCheck, 
  CreditCard, 
  Home, 
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

// Verification step component
const VerificationStep = ({ 
  step, 
  title, 
  description, 
  icon: Icon, 
  status, 
  onStart 
}: { 
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "pending" | "in_progress" | "completed";
  onStart: () => void;
}) => {
  const statusConfig = {
    pending: { color: "text-muted-foreground", bg: "bg-muted", badge: "En attente" },
    in_progress: { color: "text-yellow-600", bg: "bg-yellow-100", badge: "En cours" },
    completed: { color: "text-green-600", bg: "bg-green-100", badge: "Validé" },
  };

  const config = statusConfig[status];

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-md ${status === "completed" ? "border-green-200" : ""}`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${status === "completed" ? "bg-green-500" : status === "in_progress" ? "bg-yellow-500" : "bg-muted"}`} />
      <CardContent className="p-3 sm:p-4 pl-4 sm:pl-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-primary text-sm">{step}</span>
                <h4 className="font-semibold text-sm sm:text-base">{title}</h4>
                <Badge variant={status === "completed" ? "default" : "secondary"} className="text-xs">
                  {config.badge}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="flex justify-end sm:ml-auto shrink-0">
            {status !== "completed" && (
              <Button size="sm" onClick={onStart} disabled={status === "in_progress"} className="text-xs sm:text-sm">
                {status === "in_progress" ? "En cours..." : "Démarrer"}
              </Button>
            )}
            {status === "completed" && (
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  type VerificationStatus = "pending" | "in_progress" | "completed";
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mock state for new user - starts with no pack selected
  const [hasSelectedPack, setHasSelectedPack] = useState(false);
  const [selectedPackName, setSelectedPackName] = useState<string | null>(null);
  
  // Mock state for verification steps
  const [verificationSteps, setVerificationSteps] = useState<Record<string, VerificationStatus>>({
    email: "pending",
    phone: "pending",
    kyc: "pending",
    bank: "pending",
  });

  // Mock state for pack
  const [hasPack, setHasPack] = useState(false);
  const [verificationCredits, setVerificationCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);

  // Pack options for selection
  const packOptions = [
    { id: "starter", name: "Starter", price: "30€", credits: 5, description: "Idéal pour débuter" },
    { id: "standard", name: "Standard", price: "50€", credits: 15, description: "Le plus populaire", popular: true },
    { id: "premium", name: "Premium", price: "90€", credits: 30, description: "Pour les professionnels" },
  ];

  const handleSelectPack = (packId: string) => {
    const pack = packOptions.find(p => p.id === packId);
    if (pack) {
      setSelectedPackName(pack.name);
      setHasSelectedPack(true);
      setHasPack(true);
      setVerificationCredits(pack.credits);
      setTotalCredits(pack.credits);
    }
  };

  // Calculate progress
  const completedSteps = Object.values(verificationSteps).filter(s => s === "completed").length;
  const progressPercentage = (completedSteps / 4) * 100;
  const allVerified = completedSteps === 4;

  const handleStartVerification = (step: keyof typeof verificationSteps) => {
    setVerificationSteps(prev => ({
      ...prev,
      [step]: "in_progress"
    }));
    
    // Simulate completion after 3 seconds
    setTimeout(() => {
      setVerificationSteps(prev => ({
        ...prev,
        [step]: "completed"
      }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold">SafeVerify</span>
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

      {/* Pack Selection Overlay - shown when no pack selected */}
      {!hasSelectedPack && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8 sm:py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Package className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Bienvenue sur SafeVerify !</h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Pour accéder à votre Dashboard et commencer à vérifier vos voyageurs, 
                  choisissez le pack qui correspond à vos besoins.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {packOptions.map((pack) => (
                  <Card 
                    key={pack.id}
                    className={`relative cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                      pack.popular ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                    onClick={() => handleSelectPack(pack.id)}
                  >
                    {pack.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          Le plus populaire
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="p-4 sm:p-6 text-center">
                      <CardTitle className="text-lg sm:text-xl">{pack.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{pack.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 text-center">
                      <div className="mb-4">
                        <span className="text-3xl sm:text-4xl font-bold">{pack.price}</span>
                      </div>
                      <div className="text-sm sm:text-base text-muted-foreground mb-4">
                        <span className="font-semibold text-foreground">{pack.credits}</span> vérifications
                      </div>
                      <Button 
                        className="w-full" 
                        variant={pack.popular ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPack(pack.id);
                        }}
                      >
                        Choisir ce pack
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <p className="text-center text-xs sm:text-sm text-muted-foreground">
                Vous pourrez changer de pack à tout moment depuis votre Dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`container mx-auto px-4 py-4 sm:py-8 ${!hasSelectedPack ? "blur-sm pointer-events-none" : ""}`}>
        {/* Welcome section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Bienvenue, Propriétaire</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Complétez vos vérifications pour accéder à toutes les fonctionnalités.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Pack status */}
            {!hasPack ? (
              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600 shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg">Aucun pack actif</h3>
                      <p className="text-sm text-muted-foreground">
                        Achetez un pack de vérifications pour commencer.
                      </p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                      <Link to="/packs">
                        <Package className="h-4 w-4 mr-2" />
                        Acheter un pack
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">Pack {selectedPackName || "actif"}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{totalCredits} vérifications</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/recharger-credits">Recharger</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/changer-pack">Changer de pack</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Vérifications restantes</span>
                      <span className="font-semibold">{verificationCredits} / {totalCredits}</span>
                    </div>
                    <Progress value={(verificationCredits / totalCredits) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verification progress */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Vérifications personnelles
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Complétez ces 4 étapes pour activer votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
                {/* Progress bar */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span>Progression</span>
                    <span className="font-semibold">{completedSteps}/4 complétées</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 sm:h-3" />
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  <VerificationStep
                    step="A"
                    title="Email"
                    description="Confirmez votre adresse email via un code OTP"
                    icon={Mail}
                    status={verificationSteps.email}
                    onStart={() => handleStartVerification("email")}
                  />
                  <VerificationStep
                    step="B"
                    title="SMS"
                    description="Validez votre numéro de téléphone"
                    icon={Phone}
                    status={verificationSteps.phone}
                    onStart={() => handleStartVerification("phone")}
                  />
                  <VerificationStep
                    step="C"
                    title="KYC"
                    description="Pièce d'identité + selfie via Stripe Identity"
                    icon={FileCheck}
                    status={verificationSteps.kyc}
                    onStart={() => handleStartVerification("kyc")}
                  />
                  <VerificationStep
                    step="D"
                    title="Bancaire"
                    description="Connexion sécurisée via TrueLayer"
                    icon={CreditCard}
                    status={verificationSteps.bank}
                    onStart={() => handleStartVerification("bank")}
                  />
                </div>

                {allVerified && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 text-sm sm:text-base">Compte vérifié !</h4>
                        <p className="text-xs sm:text-sm text-green-700">
                          Vous pouvez maintenant créer vos biens.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Properties section */}
            <Card className={!allVerified ? "opacity-50 pointer-events-none" : ""}>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      Mes biens
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Gérez vos logements
                    </CardDescription>
                  </div>
                  <Button disabled={!allVerified} size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un bien
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                {!allVerified ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Home className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-xs sm:text-sm">Complétez vos vérifications (A+B+C+D) pour créer des biens</p>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Home className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-xs sm:text-sm">Aucun bien enregistré</p>
                    <Button className="mt-3 sm:mt-4" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer mon premier bien
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Account status */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Statut du compte</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Email vérifié</span>
                  {verificationSteps.email === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Téléphone vérifié</span>
                  {verificationSteps.phone === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Identité vérifiée</span>
                  {verificationSteps.kyc === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm">Compte bancaire</span>
                  {verificationSteps.bank === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Email ingestion info */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Email d'ingestion</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Configurez cette adresse comme co-hôte
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="p-2 sm:p-3 bg-muted rounded-lg font-mono text-[10px] sm:text-xs break-all">
                  host-XXXX-abc123@in.safeverify.com
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3">
                  Ajoutez cette adresse comme co-hôte Airbnb ou email secondaire Booking.
                </p>
              </CardContent>
            </Card>

            {/* Quick links */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Liens rapides</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-1 sm:space-y-2">
                <Button variant="ghost" className="w-full justify-between text-xs sm:text-sm h-9 sm:h-10" asChild>
                  <Link to="/changer-pack">
                    Changer de pack
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-between text-xs sm:text-sm h-9 sm:h-10" asChild>
                  <Link to="/recharger-credits">
                    Recharger mes crédits
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-between text-xs sm:text-sm h-9 sm:h-10">
                  Configurer la conciergerie
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between text-xs sm:text-sm h-9 sm:h-10">
                  Contacter le support
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
