import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, ArrowLeft, Zap, Star, Crown } from "lucide-react";

const packs = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: 90,
    credits: 20,
    pricePerCredit: "4,50€",
    icon: Zap,
    popular: false,
    features: [
      "20 vérifications locataires",
      "Rapport de confiance détaillé",
      "Support dédié 24/7",
      "Validité 24 mois",
      "Notifications Fraudes incluses"
    ]
  },
  {
    id: "standard",
    name: "Standard",
    price: 130,
    credits: 30,
    pricePerCredit: "4,33€",
    icon: Star,
    popular: true,
    features: [
      "30 vérifications locataires",
      "Rapport de confiance détaillé",
      "Support dédié 24/7",
      "Validité 24 mois",
      "Notifications Fraudes incluses"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 205,
    credits: 50,
    pricePerCredit: "4,10€",
    icon: Crown,
    popular: false,
    features: [
      "50 vérifications locataires",
      "Rapport de confiance détaillé",
      "Support dédié 24/7",
      "Validité 24 mois",
      "Notifications Fraudes incluses"
    ]
  }
];

const Packs = () => {
  const handleSelectPack = (packId: string) => {
    // Simulated - would redirect to Stripe Checkout
    console.log("Pack sélectionné:", packId);
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Choisissez votre pack</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Achetez des crédits de vérification pour sécuriser vos locations
          </p>
        </div>

        {/* Packs grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {packs.map((pack) => (
            <Card 
              key={pack.id} 
              className={`relative flex flex-col ${pack.popular ? "border-primary shadow-lg scale-[1.02]" : ""}`}
            >
              {pack.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Le plus populaire
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${pack.popular ? "bg-primary/10" : "bg-muted"}`}>
                  <pack.icon className={`h-6 w-6 ${pack.popular ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <CardTitle className="text-xl">{pack.name}</CardTitle>
                <CardDescription>
                  {pack.credits} vérifications
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="text-center mb-4">
                  <span className="text-3xl sm:text-4xl font-bold">{pack.price}€</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    soit {pack.pricePerCredit} / vérification
                  </p>
                </div>
                
                <ul className="space-y-2 mb-6 flex-1">
                  {pack.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={pack.popular ? "default" : "outline"}
                  onClick={() => handleSelectPack(pack.id)}
                >
                  Choisir ce pack
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-12 sm:mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Comment fonctionne un crédit ?</h3>
                <p className="text-sm text-muted-foreground">
                  1 crédit = 1 vérification complète d'un locataire (identité, email, téléphone, et plus selon les données fournies).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Les crédits expirent-ils ?</h3>
                <p className="text-sm text-muted-foreground">
                  Oui, chaque pack a une durée de validité indiquée. Vos crédits restent utilisables pendant toute cette période.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-1">Puis-je cumuler plusieurs packs ?</h3>
                <p className="text-sm text-muted-foreground">
                  Oui ! Si vous achetez un nouveau pack, les crédits s'ajoutent à votre solde existant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packs;
