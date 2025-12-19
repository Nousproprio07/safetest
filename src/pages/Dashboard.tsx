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
  ChevronRight
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
      <CardContent className="p-4 pl-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.bg}`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-primary">{step}</span>
              <h4 className="font-semibold">{title}</h4>
              <Badge variant={status === "completed" ? "default" : "secondary"} className="ml-auto">
                {config.badge}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {status !== "completed" && (
            <Button size="sm" onClick={onStart} disabled={status === "in_progress"}>
              {status === "in_progress" ? "En cours..." : "Démarrer"}
            </Button>
          )}
          {status === "completed" && (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  type VerificationStatus = "pending" | "in_progress" | "completed";
  
  // Mock state for verification steps
  const [verificationSteps, setVerificationSteps] = useState<Record<string, VerificationStatus>>({
    email: "completed",
    phone: "completed",
    kyc: "in_progress",
    bank: "pending",
  });

  // Mock state for pack
  const [hasPack, setHasPack] = useState(true);
  const [verificationCredits, setVerificationCredits] = useState(12);
  const [totalCredits, setTotalCredits] = useState(15);

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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SafeVerify</span>
          </Link>
          <div className="flex items-center gap-4">
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bienvenue, Propriétaire</h1>
          <p className="text-muted-foreground">
            Complétez vos vérifications pour accéder à toutes les fonctionnalités.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pack status */}
            {!hasPack ? (
              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="h-10 w-10 text-yellow-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Aucun pack actif</h3>
                      <p className="text-muted-foreground">
                        Achetez un pack de vérifications pour commencer à utiliser SafeVerify.
                      </p>
                    </div>
                    <Button>
                      <Package className="h-4 w-4 mr-2" />
                      Acheter un pack
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-semibold">Pack actif</h3>
                        <p className="text-sm text-muted-foreground">15 vérifications - 50€</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Recharger
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Vérifications personnelles
                </CardTitle>
                <CardDescription>
                  Complétez ces 4 étapes pour activer votre compte propriétaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression</span>
                    <span className="font-semibold">{completedSteps}/4 étapes complétées</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  <VerificationStep
                    step="A"
                    title="Vérification Email"
                    description="Confirmez votre adresse email via un code OTP"
                    icon={Mail}
                    status={verificationSteps.email}
                    onStart={() => handleStartVerification("email")}
                  />
                  <VerificationStep
                    step="B"
                    title="Vérification SMS"
                    description="Validez votre numéro de téléphone via Twilio"
                    icon={Phone}
                    status={verificationSteps.phone}
                    onStart={() => handleStartVerification("phone")}
                  />
                  <VerificationStep
                    step="C"
                    title="Vérification KYC"
                    description="Identité vérifiée via Stripe Identity (pièce d'identité + selfie)"
                    icon={FileCheck}
                    status={verificationSteps.kyc}
                    onStart={() => handleStartVerification("kyc")}
                  />
                  <VerificationStep
                    step="D"
                    title="Vérification Bancaire"
                    description="Connexion sécurisée via TrueLayer pour vérifier le titulaire"
                    icon={CreditCard}
                    status={verificationSteps.bank}
                    onStart={() => handleStartVerification("bank")}
                  />
                </div>

                {allVerified && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">Compte vérifié !</h4>
                        <p className="text-sm text-green-700">
                          Vous pouvez maintenant créer vos biens et utiliser SafeVerify.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Properties section */}
            <Card className={!allVerified ? "opacity-50 pointer-events-none" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" />
                      Mes biens
                    </CardTitle>
                    <CardDescription>
                      Gérez vos logements et configurez les vérifications
                    </CardDescription>
                  </div>
                  <Button disabled={!allVerified}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un bien
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!allVerified ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Complétez vos vérifications (A+B+C+D) pour créer des biens</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun bien enregistré</p>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer mon premier bien
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statut du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email vérifié</span>
                  {verificationSteps.email === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Téléphone vérifié</span>
                  {verificationSteps.phone === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Identité vérifiée</span>
                  {verificationSteps.kyc === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compte bancaire</span>
                  {verificationSteps.bank === "completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Email ingestion info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email d'ingestion</CardTitle>
                <CardDescription>
                  Configurez cette adresse comme co-hôte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted rounded-lg font-mono text-xs break-all">
                  host-XXXX-abc123@in.safeverify.com
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Ajoutez cette adresse comme co-hôte Airbnb ou email secondaire Booking.
                </p>
              </CardContent>
            </Card>

            {/* Quick links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Liens rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-between">
                  Gérer mon abonnement
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between">
                  Configurer la conciergerie
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between">
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
