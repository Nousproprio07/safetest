import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, ArrowLeft, Zap, Star } from "lucide-react";

// Simuler le pack actuel de l'utilisateur (à remplacer par les vraies données)
const currentUserPack = "Essentiel";

const pricingPlans = [
  {
    name: "Essentiel",
    description: "Pour les propriétaires occasionnels",
    price: "49",
    verifications: "10",
    pricePerVerif: "4,90€",
    properties: "1 logement",
    validity: "12 mois",
    features: [
      "10 vérifications incluses",
      "1 logement",
      "Score de confiance détaillé",
      "Vérification d'identité",
      "Vérification bancaire",
      "Support dédié",
      "Validité 12 mois",
    ],
    icon: Shield,
  },
  {
    name: "Pro",
    description: "Le plus populaire pour les hôtes réguliers",
    price: "130",
    verifications: "30",
    pricePerVerif: "4,33€",
    properties: "2 logements",
    validity: "12 mois",
    features: [
      "30 vérifications incluses",
      "Jusqu'à 2 logements",
      "Score de confiance détaillé",
      "Vérification d'identité",
      "Vérification bancaire",
      "Support dédié",
      "Validité 12 mois",
    ],
    icon: Star,
    popular: true,
  },
  {
    name: "Premium",
    description: "Pour les professionnels de la location",
    price: "205",
    verifications: "50",
    pricePerVerif: "4,10€",
    properties: "4 logements",
    validity: "24 mois",
    features: [
      "50 vérifications incluses",
      "Jusqu'à 4 logements",
      "Score de confiance détaillé",
      "Vérification d'identité",
      "Vérification bancaire",
      "Support dédié",
      "Validité 24 mois",
    ],
    icon: Zap,
  },
];

const ChangerPack = () => {
  const isCurrentPack = (planName: string) => planName === currentUserPack;

  const getButtonText = (planName: string) => {
    if (isCurrentPack(planName)) return "Pack actuel";
    return "Passer à ce pack";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Dashboard style */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold">SafeVerify</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Retour au dashboard</span>
              <span className="sm:hidden">Retour</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Changer de pack</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Pack actuel : <strong className="text-primary">{currentUserPack}</strong>
          </p>
        </div>

        {/* Packs grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col ${
                isCurrentPack(plan.name) 
                  ? "border-2 border-primary shadow-lg" 
                  : plan.popular 
                    ? "border-primary/50 shadow-md" 
                    : ""
              }`}
            >
              {isCurrentPack(plan.name) && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Pack actuel
                </Badge>
              )}
              {!isCurrentPack(plan.name) && plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  Le plus populaire
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                  isCurrentPack(plan.name) ? "bg-primary/10" : plan.popular ? "bg-primary/10" : "bg-muted"
                }`}>
                  <plan.icon className={`h-6 w-6 ${
                    isCurrentPack(plan.name) || plan.popular ? "text-primary" : "text-muted-foreground"
                  }`} />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="text-center mb-4">
                  <span className="text-3xl sm:text-4xl font-bold">{plan.price}€</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.verifications} vérifications • {plan.pricePerVerif}/vérif
                  </p>
                </div>
                
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={isCurrentPack(plan.name) ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={isCurrentPack(plan.name)}
                >
                  {getButtonText(plan.name)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangerPack;
