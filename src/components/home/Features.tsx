import { Shield, UserCheck, CreditCard, FileCheck, Lock, Zap } from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Vérification d'identité",
    description: "Analyse approfondie des documents d'identité avec détection de fraude avancée.",
  },
  {
    icon: FileCheck,
    title: "Cohérence des données",
    description: "Vérification croisée Personne / Réservation / Compte bancaire.",
  },
  {
    icon: Shield,
    title: "Score de confiance",
    description: "Un indicateur clair pour évaluer la fiabilité de chaque locataire.",
  },
  {
    icon: CreditCard,
    title: "Compatible Airbnb & Booking",
    description: "Intégration transparente avec les principales plateformes de location.",
  },
  {
    icon: Lock,
    title: "100% RGPD",
    description: "Vos données sont protégées et traitées conformément à la réglementation.",
  },
  {
    icon: Zap,
    title: "Résultats instantanés",
    description: "Obtenez votre score de vérification en quelques minutes seulement.",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Une protection complète contre la{" "}
            <span className="text-gradient-primary">fraude</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Notre technologie analyse et vérifie chaque réservation pour vous offrir 
            une tranquillité d'esprit totale.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 md:p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
