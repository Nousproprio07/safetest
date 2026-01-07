import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CreatePropertyDialog from "@/components/dashboard/CreatePropertyDialog";
import FraudReportDialog from "@/components/dashboard/FraudReportDialog";
import OwnerSettingsDialog from "@/components/dashboard/OwnerSettingsDialog";
import FraudReportsHistory from "@/components/dashboard/FraudReportsHistory";
import ConciergerieConfigDialog from "@/components/dashboard/ConciergerieConfigDialog";
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
  X,
  Check,
  Star,
  Zap,
  ChevronLeft,
  Copy,
  ExternalLink,
  AlertTriangle,
  User,
  Calendar,
  Users,
  Plane,
  Crown
} from "lucide-react";
import { toast } from "sonner";

// Fraud report interface
interface FraudReport {
  verificationId: string;
  reportedBy: string;
  reporterType: "proprietaire" | "conciergerie";
  reportedAt: string;
  guestName: string;
  propertyName: string;
}

// Get reported frauds from localStorage
const getReportedFrauds = (): FraudReport[] => {
  const stored = localStorage.getItem("safeverify_fraud_reports");
  return stored ? JSON.parse(stored) : [];
};

// Save reported fraud to localStorage
const saveReportedFraud = (report: FraudReport) => {
  const reports = getReportedFrauds();
  reports.push(report);
  localStorage.setItem("safeverify_fraud_reports", JSON.stringify(reports));
};

// Check if fraud already reported
const isAlreadyReported = (verificationId: string): FraudReport | null => {
  const reports = getReportedFrauds();
  return reports.find(r => r.verificationId === verificationId) || null;
};

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

interface Verification {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestFirstName: string;
  checkIn: string;
  checkOut: string;
  status: "verified" | "pending" | "fraud_detected";
  fraudReason?: string;
}

// Mock verifications with fraud detection
const mockVerifications: Verification[] = [
  { 
    id: "v1", 
    propertyId: "p1", 
    propertyName: "Studio Marais",
    guestName: "Durand", 
    guestFirstName: "Thomas", 
    checkIn: "2024-01-20", 
    checkOut: "2024-01-25", 
    status: "fraud_detected",
    fraudReason: "Document d'identité falsifié détecté"
  },
  { 
    id: "v2", 
    propertyId: "p1", 
    propertyName: "Studio Marais",
    guestName: "Martin", 
    guestFirstName: "Sophie", 
    checkIn: "2024-01-15", 
    checkOut: "2024-01-18", 
    status: "verified" 
  },
  { 
    id: "v3", 
    propertyId: "p2", 
    propertyName: "Appartement Bastille",
    guestName: "Petit", 
    guestFirstName: "Marc", 
    checkIn: "2024-01-22", 
    checkOut: "2024-01-28", 
    status: "fraud_detected",
    fraudReason: "Photos du logement trouvées sur d'autres annonces"
  },
  { 
    id: "v4", 
    propertyId: "p2", 
    propertyName: "Appartement Bastille",
    guestName: "Bernard", 
    guestFirstName: "Julie", 
    checkIn: "2024-01-10", 
    checkOut: "2024-01-12", 
    status: "verified" 
  },
  { 
    id: "v5", 
    propertyId: "p3", 
    propertyName: "Loft Oberkampf",
    guestName: "Laurent", 
    guestFirstName: "Pierre", 
    checkIn: "2024-01-08", 
    checkOut: "2024-01-14", 
    status: "pending" 
  },
];

const Dashboard = () => {
  type VerificationStatus = "pending" | "in_progress" | "completed";
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reportKey, setReportKey] = useState(0);
  const forceRerender = () => setReportKey(k => k + 1);
  
  // Mock state for new user - starts with no pack selected
  const [hasSelectedPack, setHasSelectedPack] = useState(false);
  const [selectedPackName, setSelectedPackName] = useState<string | null>(null);
  const [selectedPackPrice, setSelectedPackPrice] = useState<string | null>(null);
  
  // Mock state for verification steps
  const [verificationSteps, setVerificationSteps] = useState<Record<string, VerificationStatus>>({
    email: "pending",
    phone: "pending",
    kyc: "pending",
    bank: "pending",
  });

  // Mock state for pack
  const [hasPack, setHasPack] = useState(false);
  const [subscriptionCredits, setSubscriptionCredits] = useState(0);
  const [subscriptionTotalCredits, setSubscriptionTotalCredits] = useState(0);
  const [rechargeCredits, setRechargeCredits] = useState(5);
  const [rechargeTotalCredits, setRechargeTotalCredits] = useState(10);

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [createPropertyOpen, setCreatePropertyOpen] = useState(false);
  const [fraudReportOpen, setFraudReportOpen] = useState(false);
  const [fraudHistoryOpen, setFraudHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showVerificationDetails, setShowVerificationDetails] = useState(false);
  const [showVerificationPage, setShowVerificationPage] = useState(false);
  const [conciergerieConfigOpen, setConciergerieConfigOpen] = useState(false);
  
  // Generate unique owner code for conciergerie access
  const ownerCode = "OWN-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // User mode (Propriétaire / Voyageur)
  const [userMode, setUserMode] = useState<"proprietaire" | "voyageur">(() => {
    const stored = localStorage.getItem("safeverify_user_mode");
    return (stored as "proprietaire" | "voyageur") || "proprietaire";
  });
  
  // Conciergerie permission
  const [allowConciergeReporting, setAllowConciergeReporting] = useState(() => {
    const stored = localStorage.getItem("safeverify_owner_settings");
    if (stored) {
      const settings = JSON.parse(stored);
      return settings.allowConciergeReporting || false;
    }
    return false;
  });

  const handleUserModeChange = (checked: boolean) => {
    const newMode = checked ? "voyageur" : "proprietaire";
    setUserMode(newMode);
    localStorage.setItem("safeverify_user_mode", newMode);
    toast.success(`Mode ${newMode === "proprietaire" ? "Propriétaire" : "Voyageur"} activé`);
  };

  const handleConciergePermissionChange = (checked: boolean) => {
    setAllowConciergeReporting(checked);
    const stored = localStorage.getItem("safeverify_owner_settings");
    const settings = stored ? JSON.parse(stored) : {};
    settings.allowConciergeReporting = checked;
    localStorage.setItem("safeverify_owner_settings", JSON.stringify(settings));
    toast.success(checked ? "Permission conciergerie activée" : "Permission conciergerie désactivée");
  };

  const handlePropertyCreated = (property: Property) => {
    setProperties((prev) => [...prev, property]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers");
  };

  // Pack options from Tarifs page
  const packOptions = [
    { 
      id: "essentiel", 
      name: "Essentiel", 
      price: "49", 
      credits: 10, 
      pricePerVerif: "4,90€",
      properties: "1 logement",
      validity: "12 mois",
      description: "Pour les propriétaires occasionnels",
      icon: Shield,
      features: [
        "10 vérifications incluses",
        "1 logement",
        "Score de confiance détaillé",
        "Vérification d'identité",
        "Support par email",
      ]
    },
    { 
      id: "pro", 
      name: "Pro", 
      price: "130", 
      credits: 30, 
      pricePerVerif: "4,33€",
      properties: "2 logements",
      validity: "12 mois",
      description: "Le plus populaire pour les hôtes réguliers",
      icon: Star,
      popular: true,
      features: [
        "30 vérifications incluses",
        "Jusqu'à 2 logements",
        "Score de confiance détaillé",
        "Vérification d'identité avancée",
        "Support dédié",
      ]
    },
    { 
      id: "premium", 
      name: "Premium", 
      price: "205", 
      credits: 50, 
      pricePerVerif: "4,10€",
      properties: "4 logements",
      validity: "24 mois",
      description: "Pour les professionnels de la location",
      icon: Zap,
      features: [
        "50 vérifications incluses",
        "Jusqu'à 4 logements",
        "Score de confiance détaillé",
        "Tableau de bord analytics",
        "Support dédié prioritaire",
      ]
    },
    { 
      id: "expert", 
      name: "Expert", 
      price: "1185", 
      credits: 300, 
      pricePerVerif: "3,95€",
      properties: "6 logements",
      validity: "24 mois",
      description: "Pour les gestionnaires multi-biens",
      icon: Crown,
      features: [
        "300 vérifications incluses",
        "Jusqu'à 6 logements",
        "Score de confiance détaillé",
        "Tableau de bord analytics",
        "Support dédié prioritaire",
      ]
    },
  ];

  // Mobile scroll handling
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    if (!hasSelectedPack) {
      checkScrollButtons();
    }
  }, [hasSelectedPack]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const handleSelectPack = (packId: string) => {
    const pack = packOptions.find(p => p.id === packId);
    if (pack) {
      setSelectedPackName(pack.name);
      setSelectedPackPrice(pack.price);
      setHasSelectedPack(true);
      setHasPack(true);
      setSubscriptionCredits(pack.credits);
      setSubscriptionTotalCredits(pack.credits);
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
            {/* Mode switch */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
              <User className={`h-4 w-4 ${userMode === "proprietaire" ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${userMode === "proprietaire" ? "text-primary" : "text-muted-foreground"}`}>Propriétaire</span>
              <Switch
                checked={userMode === "voyageur"}
                onCheckedChange={handleUserModeChange}
                className="data-[state=checked]:bg-primary"
              />
              <Plane className={`h-4 w-4 ${userMode === "voyageur" ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${userMode === "voyageur" ? "text-primary" : "text-muted-foreground"}`}>Voyageur</span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)}>
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
          <div className="sm:hidden border-t border-border bg-card px-4 py-3 space-y-3">
            {/* Mode switch for mobile - optimized toggle */}
            <div className="flex rounded-lg bg-muted p-1 gap-1">
              <button
                onClick={() => userMode !== "proprietaire" && handleUserModeChange(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  userMode === "proprietaire" 
                    ? "bg-background text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                Propriétaire
              </button>
              <button
                onClick={() => userMode !== "voyageur" && handleUserModeChange(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  userMode === "voyageur" 
                    ? "bg-background text-primary shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Plane className="h-4 w-4" />
                Voyageur
              </button>
            </div>
            
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false); }}>
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
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm overflow-y-auto">
          <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="max-w-5xl mx-auto">
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

              {/* Mobile: Horizontal scroll with arrows */}
              <div className="sm:hidden relative mb-6">
                <div
                  ref={scrollRef}
                  onScroll={checkScrollButtons}
                  className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {packOptions.map((pack) => {
                    const IconComponent = pack.icon;
                    return (
                      <div
                        key={pack.id}
                        className={`relative flex-shrink-0 w-[300px] rounded-2xl p-6 snap-center cursor-pointer transition-all ${
                          pack.popular
                            ? "bg-gradient-primary text-primary-foreground"
                            : "bg-card border border-border shadow-card"
                        }`}
                        onClick={() => handleSelectPack(pack.id)}
                      >
                        {pack.popular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                            Le plus populaire
                          </div>
                        )}

                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                            pack.popular ? "bg-primary-foreground/10" : "bg-gradient-primary"
                          }`}
                        >
                          <IconComponent className="w-6 h-6 text-primary-foreground" />
                        </div>

                        <h3 className={`text-xl font-bold mb-2 ${pack.popular ? "text-primary-foreground" : "text-foreground"}`}>
                          {pack.name}
                        </h3>
                        <p className={`text-sm mb-6 ${pack.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {pack.description}
                        </p>

                        <div className="mb-6">
                          <span className={`text-4xl font-bold ${pack.popular ? "text-primary-foreground" : "text-foreground"}`}>
                            {pack.price}€
                          </span>
                          <p className={`text-sm mt-1 ${pack.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {pack.credits} vérifications • {pack.pricePerVerif}/vérif
                          </p>
                        </div>

                        <ul className="space-y-3 mb-8">
                          {pack.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pack.popular ? "text-accent" : "text-accent"}`} />
                              <span className={`text-sm ${pack.popular ? "text-primary-foreground/90" : "text-foreground"}`}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          className={`w-full ${pack.popular ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`}
                          variant={pack.popular ? "default" : "hero"}
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPack(pack.id);
                          }}
                        >
                          Choisir {pack.name}
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Arrows */}
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll("left")}
                    disabled={!canScrollLeft}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll("right")}
                    disabled={!canScrollRight}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Desktop: Grid layout */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-6 mb-8">
                {packOptions.map((pack) => {
                  const IconComponent = pack.icon;
                  return (
                    <div
                      key={pack.id}
                      className={`relative rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                        pack.popular
                          ? "bg-gradient-primary text-primary-foreground"
                          : "bg-card border border-border shadow-card"
                      }`}
                      onClick={() => handleSelectPack(pack.id)}
                    >
                      {pack.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                          Le plus populaire
                        </div>
                      )}

                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                          pack.popular ? "bg-primary-foreground/10" : "bg-gradient-primary"
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>

                      <h3 className={`text-xl font-bold mb-2 ${pack.popular ? "text-primary-foreground" : "text-foreground"}`}>
                        {pack.name}
                      </h3>
                      <p className={`text-sm mb-6 ${pack.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {pack.description}
                      </p>

                      <div className="mb-6">
                        <span className={`text-4xl font-bold ${pack.popular ? "text-primary-foreground" : "text-foreground"}`}>
                          {pack.price}€
                        </span>
                        <p className={`text-sm mt-1 ${pack.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {pack.credits} vérifications • {pack.pricePerVerif}/vérif
                        </p>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {pack.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pack.popular ? "text-accent" : "text-accent"}`} />
                            <span className={`text-sm ${pack.popular ? "text-primary-foreground/90" : "text-foreground"}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${pack.popular ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`}
                        variant={pack.popular ? "default" : "hero"}
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPack(pack.id);
                        }}
                      >
                        Choisir {pack.name}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-xs sm:text-sm text-muted-foreground">
                Vous pourrez changer de pack à tout moment depuis votre Dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Verification Page - Full screen view */}
      {showVerificationPage ? (
        <div className="container mx-auto px-4 py-4 sm:py-8">
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4"
            onClick={() => setShowVerificationPage(false)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour au Dashboard
          </Button>

          {/* Verification card */}
          {(() => {
            const verificationDate = new Date();
            const renewalDate = new Date(verificationDate);
            renewalDate.setFullYear(renewalDate.getFullYear() + 1);
            
            const now = new Date();
            const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const canRenew = daysUntilRenewal <= 30;

            return (
              <Card>
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Vérifications personnelles
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {canRenew 
                      ? "Vous pouvez mettre à jour vos vérifications" 
                      : "Vos vérifications sont à jour"
                    }
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
                      status={canRenew ? verificationSteps.email : "completed"}
                      onStart={() => canRenew && handleStartVerification("email")}
                    />
                    <VerificationStep
                      step="B"
                      title="SMS"
                      description="Validez votre numéro de téléphone"
                      icon={Phone}
                      status={canRenew ? verificationSteps.phone : "completed"}
                      onStart={() => canRenew && handleStartVerification("phone")}
                    />
                    <VerificationStep
                      step="C"
                      title="KYC"
                      description="Pièce d'identité + selfie via Stripe Identity"
                      icon={FileCheck}
                      status={canRenew ? verificationSteps.kyc : "completed"}
                      onStart={() => canRenew && handleStartVerification("kyc")}
                    />
                    <VerificationStep
                      step="D"
                      title="Bancaire"
                      description="Connexion sécurisée via TrueLayer"
                      icon={CreditCard}
                      status={canRenew ? verificationSteps.bank : "completed"}
                      onStart={() => canRenew && handleStartVerification("bank")}
                    />
                  </div>

                  {/* Renewal info */}
                  {canRenew ? (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-700 font-medium">
                        ⚠️ Renouvellement dans {daysUntilRenewal} jours
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        Cliquez sur "Démarrer" pour mettre à jour vos vérifications.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">
                        ✓ Vérifications valides
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Prochaine mise à jour possible dans {daysUntilRenewal - 30} jours.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}
        </div>
      ) : (
        <div className={`container mx-auto px-4 py-4 sm:py-8 ${!hasSelectedPack ? "blur-sm pointer-events-none" : ""}`}>
          {/* Welcome section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Bienvenue, Propriétaire</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Complétez vos vérifications pour accéder à toutes les fonctionnalités.
            </p>
          </div>

        {/* Fraud Alerts Section - Only visible after verification complete and property added */}
        {allVerified && properties.length > 0 && mockVerifications.filter(v => v.status === "fraud_detected").length > 0 && (
          <Card className="mb-6 border-2 border-red-500 bg-red-50 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-red-700">
                    🚨 Fraude détectée
                  </h3>
                  <p className="text-sm text-red-600">
                    {mockVerifications.filter(v => v.status === "fraud_detected").length} alerte(s) à traiter
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {mockVerifications
                  .filter(v => v.status === "fraud_detected")
                  .map((verification) => {
                    const existingReport = isAlreadyReported(verification.id);
                    const handleReport = () => {
                      saveReportedFraud({
                        verificationId: verification.id,
                        reportedBy: "Vous (Propriétaire)",
                        reporterType: "proprietaire",
                        reportedAt: new Date().toISOString(),
                        guestName: `${verification.guestFirstName} ${verification.guestName}`,
                        propertyName: verification.propertyName
                      });
                      toast.success("Signalement transmis à SafeVerify", {
                        description: `Les informations concernant ${verification.guestFirstName} ${verification.guestName} ont été transmises à notre support et enregistrées comme fraude pour protéger tous les autres utilisateurs.`,
                        duration: 6000
                      });
                      // Force re-render
                      forceRerender();
                    };
                    
                    return (
                      <div
                        key={verification.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-300"
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                          <div>
                            <span className="font-semibold text-foreground">{verification.propertyName}</span>
                            <span className="text-muted-foreground mx-2">•</span>
                            <span className="text-red-700 font-medium">
                              {verification.guestFirstName} {verification.guestName}
                            </span>
                          </div>
                        </div>
                        {existingReport ? (
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              ✓ Signalé par {existingReport.reporterType === "conciergerie" ? "la conciergerie" : existingReport.reportedBy}
                            </Badge>
                            {existingReport.reporterType === "conciergerie" && (
                              <span className="text-xs text-muted-foreground">
                                La conciergerie a déjà transmis la fraude au service SafeVerify
                              </span>
                            )}
                          </div>
                        ) : (
                          <Button size="sm" variant="destructive" onClick={handleReport}>
                            Signaler
                          </Button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

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
                        <p className="text-xs sm:text-sm text-muted-foreground">{subscriptionCredits + rechargeCredits} crédits restants</p>
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
                  
                  {/* Crédits abonnement */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm mb-2 gap-1">
                        <span className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary shrink-0" />
                          <span>Crédits abonnement</span>
                        </span>
                        <span className="font-semibold">{subscriptionCredits} / {subscriptionTotalCredits}</span>
                      </div>
                      <Progress value={subscriptionTotalCredits > 0 ? (subscriptionCredits / subscriptionTotalCredits) * 100 : 0} className="h-2 sm:h-3" />
                    </div>

                    {/* Crédits recharge */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm mb-2 gap-1">
                        <span className="flex items-center gap-2">
                          <Plus className="h-4 w-4 text-green-500 shrink-0" />
                          <span>Crédits recharge</span>
                        </span>
                        <span className="font-semibold">{rechargeCredits} / {rechargeTotalCredits}</span>
                      </div>
                      <Progress value={rechargeTotalCredits > 0 ? (rechargeCredits / rechargeTotalCredits) * 100 : 0} className="h-2 sm:h-3 [&>div]:bg-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verification progress - collapsible when all verified */}
            {allVerified && !showVerificationDetails ? (
              <>
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 text-sm sm:text-base">Compte vérifié ✓</h3>
                        <p className="text-xs sm:text-sm text-green-700">
                          Toutes vos vérifications sont complétées
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        4/4
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Mobile: Prochaine vérification - right after Compte vérifié */}
                {(() => {
                  const verificationDate = new Date();
                  const renewalDate = new Date(verificationDate);
                  renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                  
                  const now = new Date();
                  const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntilRenewal <= 30;
                  
                  const formatDate = (date: Date) => {
                    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
                  };
                  
                  return (
                    <Card className={`sm:hidden ${isUrgent ? "border-orange-300 bg-orange-50/50" : "border-green-200 bg-green-50/50"}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isUrgent ? "bg-orange-100" : "bg-green-100"}`}>
                            <Calendar className={`h-5 w-5 ${isUrgent ? "text-orange-600" : "text-green-600"}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs ${isUrgent ? "text-orange-600" : "text-green-600"}`}>
                              {isUrgent ? "Renouvellement bientôt" : "Prochaine vérification"}
                            </p>
                            <p className={`font-semibold text-sm ${isUrgent ? "text-orange-700" : "text-green-700"}`}>
                              {formatDate(renewalDate)}
                            </p>
                          </div>
                          {isUrgent && (
                            <Badge className="bg-orange-500 text-white">
                              {daysUntilRenewal}j
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}
              </>
            ) : (
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
                </CardContent>
              </Card>
            )}

            {/* Properties section */}
            <Card className={!allVerified ? "opacity-50 pointer-events-none" : ""}>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      Mes biens ({properties.length})
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Gérez vos logements
                    </CardDescription>
                  </div>
                  <Button 
                    disabled={!allVerified} 
                    size="sm" 
                    className="w-full sm:w-auto"
                    onClick={() => setCreatePropertyOpen(true)}
                  >
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
                ) : properties.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-muted-foreground">
                    <Home className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                    <p className="text-xs sm:text-sm">Aucun bien enregistré</p>
                    <Button 
                      className="mt-3 sm:mt-4" 
                      size="sm"
                      onClick={() => setCreatePropertyOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Créer mon premier bien
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {properties.map((property) => (
                      <div
                        key={property.id}
                        className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Property photo */}
                          {property.photos[0] && (
                            <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={property.photos[0]}
                                alt={property.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Property info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base truncate">
                              {property.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {property.address}, {property.postalCode} {property.city}
                            </p>
                            
                            {/* Property code and link */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Badge variant="secondary" className="font-mono">
                                {property.propertyCode}
                                <button
                                  onClick={() => copyToClipboard(property.propertyCode)}
                                  className="ml-2 hover:text-primary"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="cursor-pointer hover:bg-muted"
                                onClick={() => copyToClipboard(property.verificationLink)}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Lien de vérification
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conciergerie permission */}
            <Card className={!allVerified ? "opacity-50 pointer-events-none" : ""}>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="allowConciergeReporting"
                    checked={allowConciergeReporting}
                    onCheckedChange={(checked) => handleConciergePermissionChange(checked === true)}
                    disabled={!allVerified}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="allowConciergeReporting"
                      className="text-sm font-medium cursor-pointer flex items-center gap-2"
                    >
                      <Users className="h-4 w-4 text-primary" />
                      Autoriser ma conciergerie
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Si activé, votre conciergerie pourra signaler des fraudes sur vos biens au service SafeVerify.
                    </p>
                  </div>
                </div>
                
                {/* Configurer conciergerie button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-between text-xs sm:text-sm"
                  disabled={!allVerified}
                  onClick={() => setConciergerieConfigOpen(true)}
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configurer ma conciergerie
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Account status - Desktop full version */}
            {(() => {
              // Calculate renewal date for desktop display
              const verificationDateDesktop = new Date();
              const renewalDateDesktop = new Date(verificationDateDesktop);
              renewalDateDesktop.setFullYear(renewalDateDesktop.getFullYear() + 1);
              
              const nowDesktop = new Date();
              const daysUntilRenewalDesktop = Math.ceil((renewalDateDesktop.getTime() - nowDesktop.getTime()) / (1000 * 60 * 60 * 24));
              const isUrgentDesktop = daysUntilRenewalDesktop <= 30;
              
              const formatDateDesktop = (date: Date) => {
                return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
              };
              
              return (
                <Card className="hidden sm:block">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg">Statut du compte</CardTitle>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isUrgentDesktop ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                        <Calendar className="h-3 w-3" />
                        <span>{formatDateDesktop(renewalDateDesktop)}</span>
                      </div>
                    </div>
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
              );
            })()}

            {/* Message automatique */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Message automatique
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  À envoyer à vos voyageurs sur Airbnb/Booking
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="p-3 bg-muted rounded-lg text-xs sm:text-sm space-y-2">
                  <p>Bonjour et merci pour votre réservation ! 🏠</p>
                  <p>Pour garantir la sécurité de tous, nous utilisons SafeVerify pour vérifier l'identité de nos voyageurs.</p>
                  <p>Merci de compléter votre vérification en cliquant sur ce lien : <span className="text-primary font-medium">[Lien de vérification]</span></p>
                  <p>Cette étape ne prend que 2 minutes. À très bientôt !</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => {
                    const message = `Bonjour et merci pour votre réservation ! 🏠\n\nPour garantir la sécurité de tous, nous utilisons SafeVerify pour vérifier l'identité de nos voyageurs.\n\nMerci de compléter votre vérification en cliquant sur ce lien : [Lien de vérification]\n\nCette étape ne prend que 2 minutes. À très bientôt !`;
                    navigator.clipboard.writeText(message);
                    toast.success("Message copié dans le presse-papiers");
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le message
                </Button>
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
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-xs sm:text-sm h-9 sm:h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setFraudReportOpen(true)}
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Signaler une fraude
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-xs sm:text-sm h-9 sm:h-10"
                  onClick={() => setFraudHistoryOpen(true)}
                >
                  <span className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Historique des signalements
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-xs sm:text-sm h-9 sm:h-10"
                  onClick={() => setShowVerificationPage(true)}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Vérifications personnelles
                  </span>
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
      )}

      {/* Create Property Dialog */}
      <CreatePropertyDialog
        open={createPropertyOpen}
        onOpenChange={setCreatePropertyOpen}
        onPropertyCreated={handlePropertyCreated}
      />

      {/* Fraud Report Dialog */}
      <FraudReportDialog
        open={fraudReportOpen}
        onOpenChange={setFraudReportOpen}
        allVerified={allVerified}
        hasActivePack={hasPack}
      />

      {/* Owner Settings Dialog */}
      <OwnerSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      {/* Fraud Reports History Dialog */}
      <FraudReportsHistory
        open={fraudHistoryOpen}
        onOpenChange={setFraudHistoryOpen}
      />

      {/* Conciergerie Config Dialog */}
      <ConciergerieConfigDialog
        open={conciergerieConfigOpen}
        onOpenChange={setConciergerieConfigOpen}
        properties={properties}
        ownerCode={ownerCode}
      />
    </div>
  );
};

export default Dashboard;
