import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Package, Plus, History, CreditCard, Calendar } from "lucide-react";

// Mock data
const currentPack = {
  name: "Standard",
  subscriptionCredits: 8,
  subscriptionTotalCredits: 15,
  rechargeCredits: 12,
  rechargeTotalCredits: 20,
  purchaseDate: "15 décembre 2024",
  expiryDate: "15 décembre 2025",
  price: 50
};

const purchaseHistory = [
  { id: 1, date: "15 déc. 2024", pack: "Standard", credits: 15, amount: "50€" },
  { id: 2, date: "01 oct. 2024", pack: "Recharge 20", credits: 20, amount: "90€", isRecharge: true },
  { id: 3, date: "01 oct. 2024", pack: "Starter", credits: 5, amount: "29€" },
];

const Abonnement = () => {
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mon abonnement</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gérez vos crédits et consultez votre historique
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current pack */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Pack {currentPack.name}</CardTitle>
                      <CardDescription>Acheté le {currentPack.purchaseDate}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit">Actif</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Crédits abonnement */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      Crédits abonnement (Pack)
                    </span>
                    <span className="font-semibold">{currentPack.subscriptionCredits} / {currentPack.subscriptionTotalCredits}</span>
                  </div>
                  <Progress value={(currentPack.subscriptionCredits / currentPack.subscriptionTotalCredits) * 100} className="h-3" />
                </div>

                {/* Crédits recharge */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-green-500" />
                      Crédits recharge (Achetés en plus)
                    </span>
                    <span className="font-semibold">{currentPack.rechargeCredits} / {currentPack.rechargeTotalCredits}</span>
                  </div>
                  <Progress value={(currentPack.rechargeCredits / currentPack.rechargeTotalCredits) * 100} className="h-3 [&>div]:bg-green-500" />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Calendar className="h-3 w-3" />
                      Expiration
                    </div>
                    <p className="font-medium text-sm">{currentPack.expiryDate}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <CreditCard className="h-3 w-3" />
                      Montant payé
                    </div>
                    <p className="font-medium text-sm">{currentPack.price}€</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <Link to="/packs">
                      <Plus className="h-4 w-4 mr-2" />
                      Recharger mes crédits
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/packs">
                      Changer de pack
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Purchase history */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historique des achats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {purchaseHistory.map((purchase) => (
                    <div 
                      key={purchase.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Pack {purchase.pack}</p>
                          <p className="text-xs text-muted-foreground">{purchase.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{purchase.amount}</p>
                        <p className="text-xs text-muted-foreground">{purchase.credits} crédits</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Crédits pack restants</span>
                  <span className="font-semibold text-primary">{currentPack.subscriptionCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Crédits recharge restants</span>
                  <span className="font-semibold text-green-500">{currentPack.rechargeCredits}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-sm font-medium">Total crédits disponibles</span>
                  <span className="font-bold">{currentPack.subscriptionCredits + currentPack.rechargeCredits}</span>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">Besoin de plus de crédits ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Économisez jusqu'à 49% avec nos packs volume
                </p>
                <Button asChild className="w-full">
                  <Link to="/packs">Voir les packs</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Besoin d'aide ?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Notre équipe est disponible pour répondre à vos questions.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contacter le support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Abonnement;
