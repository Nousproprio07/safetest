import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, Star, Shield, Zap } from "lucide-react";

const pricingPlans = [
  {
    name: "Essentiel",
    description: "Pour les propriétaires occasionnels",
    price: "49",
    verifications: "10",
    pricePerVerif: "4,90€",
    features: [
      "10 vérifications incluses",
      "Score de confiance détaillé",
      "Vérification d'identité",
      "Support par email",
      "Validité 12 mois",
    ],
    popular: false,
    icon: Shield,
  },
  {
    name: "Pro",
    description: "Le plus populaire pour les hôtes réguliers",
    price: "119",
    verifications: "25",
    pricePerVerif: "4,76€",
    features: [
      "25 vérifications incluses",
      "Score de confiance détaillé",
      "Vérification d'identité avancée",
      "Vérification bancaire",
      "Support prioritaire",
      "Validité 12 mois",
      "Déductible en frais réels",
    ],
    popular: true,
    icon: Star,
  },
  {
    name: "Premium",
    description: "Pour les professionnels de la location",
    price: "229",
    verifications: "50",
    pricePerVerif: "4,58€",
    features: [
      "50 vérifications incluses",
      "Score de confiance détaillé",
      "Vérification complète multi-critères",
      "API d'intégration",
      "Tableau de bord analytics",
      "Support dédié",
      "Validité 12 mois",
    ],
    popular: false,
    icon: Zap,
  },
];

const Tarifs = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-up">
            Des tarifs <span className="text-gradient-primary">transparents</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up animation-delay-100">
            Choisissez le pack adapté à vos besoins. Seuls les propriétaires paient, 
            jamais les locataires. Déductible en frais réels.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 md:p-8 animate-fade-up ${
                  plan.popular
                    ? "bg-gradient-primary text-primary-foreground scale-105 shadow-xl"
                    : "bg-card border border-border shadow-card"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                    Le plus populaire
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    plan.popular
                      ? "bg-primary-foreground/10"
                      : "bg-gradient-primary"
                  }`}
                >
                  <plan.icon
                    className={`w-6 h-6 ${
                      plan.popular ? "text-primary-foreground" : "text-primary-foreground"
                    }`}
                  />
                </div>

                {/* Plan Info */}
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.popular ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold ${
                        plan.popular ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {plan.price}€
                    </span>
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {plan.verifications} vérifications • {plan.pricePerVerif}/vérif
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? "text-accent" : "text-accent"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.popular
                            ? "text-primary-foreground/90"
                            : "text-foreground"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "hero"}
                  size="lg"
                >
                  Choisir ce pack
                </Button>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <p className="text-muted-foreground">
              <strong className="text-foreground">Besoin d'un volume plus important ?</strong>
              {" "}Contactez-nous pour un tarif personnalisé adapté à vos besoins.
            </p>
            <Button variant="outline-primary" className="mt-4">
              Nous contacter
            </Button>
          </div>
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
                answer: "Les vérifications sont valables 12 mois à compter de la date d'achat.",
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
