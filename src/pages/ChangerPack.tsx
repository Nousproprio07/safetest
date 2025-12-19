import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, ArrowLeft, Zap, Star, Crown, Home } from "lucide-react";

const subscriptionPlans = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: 90,
    properties: 1,
    verifications: 20,
    validity: "12 mois",
    pricePerVerification: "4,50€",
    icon: Zap,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 130,
    properties: 2,
    verifications: 30,
    validity: "12 mois",
    pricePerVerification: "4,33€",
    icon: Star,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 205,
    properties: 4,
    verifications: 50,
    validity: "24 mois",
    pricePerVerification: "4,10€",
    icon: Crown,
    popular: false,
  }
];

// Simulated current plan
const currentPlan = "essentiel";

const ChangerPack = () => {
  const handleSelectPlan = (planId: string) => {
    console.log("Plan sélectionné:", planId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            Choisissez le pack adapté à vos besoins
          </p>
        </div>

        {/* Current plan info */}
        <div className="max-w-5xl mx-auto mb-8">
          <Card className="bg-muted/50">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">Votre pack actuel</p>
                <p className="font-semibold text-lg capitalize">{currentPlan}</p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                Actif
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Subscription plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {subscriptionPlans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isUpgrade = subscriptionPlans.findIndex(p => p.id === plan.id) > subscriptionPlans.findIndex(p => p.id === currentPlan);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-[1.02]" : ""} ${isCurrent ? "border-green-500 border-2" : ""}`}
              >
                {plan.popular && !isCurrent && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Recommandé
                  </Badge>
                )}
                {isCurrent && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                    Pack actuel
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${plan.popular ? "bg-primary/10" : "bg-muted"}`}>
                    <plan.icon className={`h-6 w-6 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>
                    Jusqu'à {plan.properties} {plan.properties > 1 ? "biens" : "bien"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="text-center mb-4">
                    <span className="text-3xl sm:text-4xl font-bold">{plan.price}€</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {plan.verifications} vérifications incluses
                    </p>
                  </div>
                  
                  <ul className="space-y-2 mb-6 flex-1">
                    <li className="flex items-start gap-2 text-sm">
                      <Home className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="font-medium">Jusqu'à {plan.properties} {plan.properties > 1 ? "biens gérés" : "bien géré"}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{plan.verifications} vérifications incluses</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{plan.pricePerVerification} / vérification</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Validité {plan.validity}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Rapport de confiance détaillé</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Support dédié 24/7</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Notifications Fraudes incluses</span>
                    </li>
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={isCurrent ? "outline" : (plan.popular ? "default" : "outline")}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Pack actuel" : isUpgrade ? "Passer à ce pack" : "Choisir ce pack"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info section */}
        <div className="mt-12 sm:mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Que se passe-t-il si je change de pack ?</h3>
                <p className="text-sm text-muted-foreground">
                  Vos crédits actuels sont conservés. Vous bénéficiez immédiatement des avantages du nouveau pack (plus de biens, nouvelles vérifications).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Puis-je rétrograder mon pack ?</h3>
                <p className="text-sm text-muted-foreground">
                  Oui, mais si vous avez plus de biens que le pack inférieur ne le permet, vous devrez d'abord supprimer des biens.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Comment recharger mes crédits ?</h3>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez acheter des packs de crédits supplémentaires à tout moment depuis la page{" "}
                  <Link to="/recharger-credits" className="text-primary hover:underline">Recharger mes crédits</Link>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangerPack;
