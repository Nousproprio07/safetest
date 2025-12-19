import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, ArrowLeft, Zap, Star, Crown } from "lucide-react";

// Simuler le pack actuel de l'utilisateur (à remplacer par les vraies données)
const currentUserPack = "Essentiel";

// Prix par vérification selon le pack de l'utilisateur
const pricePerVerifByPack: Record<string, number> = {
  "Essentiel": 4.50,
  "Pro": 4.33,
  "Premium": 4.10,
};

const getCreditPacks = (userPack: string) => {
  const pricePerVerif = pricePerVerifByPack[userPack] || 4.50;
  
  return [
    {
      id: "recharge-20",
      name: "20 vérifications",
      price: Math.round(20 * pricePerVerif),
      credits: 20,
      pricePerCredit: `${pricePerVerif.toFixed(2).replace('.', ',')}€`,
      icon: Zap,
      popular: false,
    },
    {
      id: "recharge-30",
      name: "30 vérifications",
      price: Math.round(30 * pricePerVerif),
      credits: 30,
      pricePerCredit: `${pricePerVerif.toFixed(2).replace('.', ',')}€`,
      icon: Star,
      popular: true,
    },
    {
      id: "recharge-50",
      name: "50 vérifications",
      price: Math.round(50 * pricePerVerif),
      credits: 50,
      pricePerCredit: `${pricePerVerif.toFixed(2).replace('.', ',')}€`,
      icon: Crown,
      popular: false,
    }
  ];
};

const RechargerCredits = () => {
  const creditPacks = getCreditPacks(currentUserPack);
  
  const handleSelectPack = (packId: string) => {
    console.log("Pack crédit sélectionné:", packId);
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Recharger mes crédits</h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Pack actuel : <strong className="text-primary">{currentUserPack}</strong> • Prix par vérification : {pricePerVerifByPack[currentUserPack].toFixed(2).replace('.', ',')}€
          </p>
        </div>

        {/* Credit packs grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {creditPacks.map((pack) => (
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
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{pack.credits} vérifications locataires</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Rapport de confiance détaillé</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Notifications Fraudes incluses</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Crédits cumulables</span>
                  </li>
                </ul>

                <Button 
                  className="w-full" 
                  variant={pack.popular ? "default" : "outline"}
                  onClick={() => handleSelectPack(pack.id)}
                >
                  Acheter ce pack
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info */}
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
                <h3 className="font-medium mb-1">Puis-je cumuler plusieurs packs ?</h3>
                <p className="text-sm text-muted-foreground">
                  Oui ! Si vous achetez un nouveau pack de crédits, ils s'ajoutent à votre solde existant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargerCredits;
