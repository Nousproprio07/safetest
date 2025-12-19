import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, Star, Shield, Zap, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      "Vérification d'identité avancée",
      "Vérification bancaire",
      "Support par email",
      "Support dédié",
      "Tableau de bord analytics",
      "Validité 12 mois",
    ],
    popular: false,
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
      "Vérification d'identité avancée",
      "Vérification bancaire",
      "Support par email",
      "Support dédié",
      "Tableau de bord analytics",
      "Validité 12 mois",
    ],
    popular: true,
    icon: Star,
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
      "Vérification d'identité avancée",
      "Vérification bancaire",
      "Support par email",
      "Support dédié",
      "Tableau de bord analytics",
      "Validité 24 mois",
    ],
    popular: false,
    icon: Zap,
  },
];

const comparisonFeatures = [
  { name: "Vérifications incluses", essentiel: "10", pro: "30", premium: "50" },
  { name: "Prix par vérification", essentiel: "4,90€", pro: "4,33€", premium: "4,10€" },
  { name: "Logements", essentiel: "1", pro: "2", premium: "4" },
  { name: "Score de confiance détaillé", essentiel: true, pro: true, premium: true },
  { name: "Vérification d'identité", essentiel: true, pro: true, premium: true },
  { name: "Vérification d'identité avancée", essentiel: true, pro: true, premium: true },
  { name: "Vérification bancaire", essentiel: true, pro: true, premium: true },
  { name: "Support par email", essentiel: true, pro: true, premium: true },
  { name: "Support dédié", essentiel: true, pro: true, premium: true },
  { name: "Tableau de bord analytics", essentiel: true, pro: true, premium: true },
  { name: "Validité", essentiel: "12 mois", pro: "12 mois", premium: "24 mois" },
];

const Tarifs = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const location = useLocation();
  
  const isChangerPackPage = location.pathname === "/changer-pack";

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

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

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-accent mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
      );
    }
    return <span className="font-medium">{value}</span>;
  };

  const getButtonText = (planName: string) => {
    if (!isChangerPackPage) {
      return `Choisir ${planName}`;
    }
    if (planName === currentUserPack) {
      return "Pack actuel";
    }
    return "Passer à ce pack";
  };

  const isCurrentPack = (planName: string) => {
    return isChangerPackPage && planName === currentUserPack;
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
            {isChangerPackPage ? (
              <>Changer de <span className="text-gradient-primary">pack</span></>
            ) : (
              <>Des tarifs <span className="text-gradient-primary">transparents</span></>
            )}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up animation-delay-100">
            {isChangerPackPage ? (
              <>Votre pack actuel : <strong className="text-primary">{currentUserPack}</strong>. Passez à un pack supérieur pour plus de fonctionnalités.</>
            ) : (
              <>Choisissez le pack adapté à vos besoins. Seuls les propriétaires paient, jamais les locataires. Déductible en frais réels.</>
            )}
          </p>
        </div>
      </section>

      {/* Pricing Cards - Mobile Carousel */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto">
          {/* Mobile: Horizontal scroll with arrows */}
          <div className="md:hidden relative">
            <div
              ref={scrollRef}
              onScroll={checkScrollButtons}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex-shrink-0 w-[300px] rounded-2xl p-6 snap-center ${
                    isCurrentPack(plan.name)
                      ? "bg-card border-2 border-primary shadow-card"
                      : plan.popular
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-card border border-border shadow-card"
                  }`}
                >
                  {isCurrentPack(plan.name) && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                      Pack actuel
                    </div>
                  )}
                  {!isCurrentPack(plan.name) && plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                      Le plus populaire
                    </div>
                  )}

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                      plan.popular && !isCurrentPack(plan.name) ? "bg-primary-foreground/10" : "bg-gradient-primary"
                    }`}
                  >
                    <plan.icon className="w-6 h-6 text-primary-foreground" />
                  </div>

                  <h3 className={`text-xl font-bold mb-2 ${plan.popular && !isCurrentPack(plan.name) ? "text-primary-foreground" : "text-foreground"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.popular && !isCurrentPack(plan.name) ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${plan.popular && !isCurrentPack(plan.name) ? "text-primary-foreground" : "text-foreground"}`}>
                      {plan.price}€
                    </span>
                    <p className={`text-sm mt-1 ${plan.popular && !isCurrentPack(plan.name) ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {plan.verifications} vérifications • {plan.pricePerVerif}/vérif
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular && !isCurrentPack(plan.name) ? "text-accent" : "text-accent"}`} />
                        <span className={`text-sm ${plan.popular && !isCurrentPack(plan.name) ? "text-primary-foreground/90" : "text-foreground"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular && !isCurrentPack(plan.name) ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`}
                    variant={isCurrentPack(plan.name) ? "outline" : plan.popular ? "default" : "hero"}
                    size="lg"
                    disabled={isCurrentPack(plan.name)}
                  >
                    {getButtonText(plan.name)}
                  </Button>
                </div>
              ))}
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

          {/* Desktop: Comparison Table */}
          <div className="hidden md:block max-w-5xl mx-auto">
            <div className="rounded-2xl border border-border overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[280px] font-semibold text-foreground">Fonctionnalités</TableHead>
                    <TableHead className={`text-center font-semibold text-foreground ${isCurrentPack("Essentiel") ? "bg-primary/10 border-x border-primary/20" : ""}`}>
                      <div className="flex flex-col items-center gap-1">
                        <Shield className="w-5 h-5 text-primary" />
                        <span>Essentiel</span>
                        {isCurrentPack("Essentiel") && (
                          <span className="text-xs text-primary font-medium">Pack actuel</span>
                        )}
                        <span className="text-2xl font-bold text-primary">49€</span>
                      </div>
                    </TableHead>
                    <TableHead className={`text-center font-semibold text-foreground ${isCurrentPack("Pro") ? "bg-primary/10 border-x border-primary/20" : !isChangerPackPage ? "bg-primary/10 border-x border-primary/20" : ""}`}>
                      <div className="flex flex-col items-center gap-1">
                        <Star className="w-5 h-5 text-primary" />
                        <span>Pro</span>
                        {isCurrentPack("Pro") ? (
                          <span className="text-xs text-primary font-medium">Pack actuel</span>
                        ) : !isChangerPackPage && (
                          <span className="text-xs text-primary font-medium">Le plus populaire</span>
                        )}
                        <span className="text-2xl font-bold text-primary">130€</span>
                      </div>
                    </TableHead>
                    <TableHead className={`text-center font-semibold text-foreground ${isCurrentPack("Premium") ? "bg-primary/10 border-x border-primary/20" : ""}`}>
                      <div className="flex flex-col items-center gap-1">
                        <Zap className="w-5 h-5 text-primary" />
                        <span>Premium</span>
                        {isCurrentPack("Premium") && (
                          <span className="text-xs text-primary font-medium">Pack actuel</span>
                        )}
                        <span className="text-2xl font-bold text-primary">205€</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonFeatures.map((feature, index) => (
                    <TableRow key={feature.name} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <TableCell className="font-medium text-foreground">{feature.name}</TableCell>
                      <TableCell className={`text-center ${isCurrentPack("Essentiel") ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                        {renderFeatureValue(feature.essentiel)}
                      </TableCell>
                      <TableCell className={`text-center ${isCurrentPack("Pro") ? "bg-primary/5 border-x border-primary/10" : !isChangerPackPage ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                        {renderFeatureValue(feature.pro)}
                      </TableCell>
                      <TableCell className={`text-center ${isCurrentPack("Premium") ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                        {renderFeatureValue(feature.premium)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className={`text-center py-6 ${isCurrentPack("Essentiel") ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                      <Button 
                        variant={isCurrentPack("Essentiel") ? "outline" : "outline-primary"} 
                        className="w-full max-w-[160px]"
                        disabled={isCurrentPack("Essentiel")}
                      >
                        {getButtonText("Essentiel")}
                      </Button>
                    </TableCell>
                    <TableCell className={`text-center py-6 ${isCurrentPack("Pro") ? "bg-primary/5 border-x border-primary/10" : !isChangerPackPage ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                      <Button 
                        variant={isCurrentPack("Pro") ? "outline" : "hero"} 
                        className="w-full max-w-[160px]"
                        disabled={isCurrentPack("Pro")}
                      >
                        {getButtonText("Pro")}
                      </Button>
                    </TableCell>
                    <TableCell className={`text-center py-6 ${isCurrentPack("Premium") ? "bg-primary/5 border-x border-primary/10" : ""}`}>
                      <Button 
                        variant={isCurrentPack("Premium") ? "outline" : "outline-primary"} 
                        className="w-full max-w-[160px]"
                        disabled={isCurrentPack("Premium")}
                      >
                        {getButtonText("Premium")}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Additional Info */}
          {!isChangerPackPage && (
            <div className="mt-16 text-center max-w-2xl mx-auto">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Besoin d'un volume plus important ?</strong>
                {" "}Contactez-nous pour un tarif personnalisé adapté à vos besoins.
              </p>
              <Button variant="outline-primary" className="mt-4">
                Nous contacter
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Questions fréquentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "Qui paie les vérifications ?",
                answer: "Seul le propriétaire ou la conciergerie paie. Le locataire n'a jamais de frais à sa charge.",
              },
              {
                question: "Les vérifications sont-elles déductibles ?",
                answer: "Oui, les packs SafeVerify sont déductibles en frais réels pour les revenus locatifs.",
              },
              {
                question: "Quelle est la durée de validité ?",
                answer: "Les vérifications sont valables 12 mois pour les packs Essentiel et Pro, et 24 mois pour le pack Premium.",
              },
              {
                question: "Puis-je changer de pack ?",
                answer: "Oui, vous pouvez upgrader votre pack à tout moment. Le solde restant sera reporté.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tarifs;
