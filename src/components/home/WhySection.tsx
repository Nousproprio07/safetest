import { ShieldAlert, UserX, CreditCard, AlertTriangle } from "lucide-react";

const fraudTypes = [
  {
    icon: UserX,
    title: "Usurpation d'identité",
    description: "Des fraudeurs volent l'identité de voyageurs honnêtes pour réserver à leur place.",
  },
  {
    icon: AlertTriangle,
    title: "Faux profils",
    description: "Création de comptes fictifs avec de fausses évaluations pour paraître fiables.",
  },
  {
    icon: CreditCard,
    title: "Réservations frauduleuses",
    description: "Paiements avec des cartes volées ou contestations abusives après le séjour.",
  },
  {
    icon: ShieldAlert,
    title: "Pertes financières",
    description: "Dégradations, impayés, sous-location illégale, squat et litiges coûteux pour les propriétaires.",
  },
];

const WhySection = () => {
  return (
    <section className="py-16 md:py-24 bg-destructive/5">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4 animate-fade-up">
            Pourquoi SafeVerify ?
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 animate-fade-up animation-delay-100">
            La fraude locative explose
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up animation-delay-200">
            Le marché de la location courte et longue durée est devenu une cible privilégiée 
            des fraudeurs. Propriétaires et voyageurs en subissent les conséquences.
          </p>
        </div>

        {/* Fraud Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
          {fraudTypes.map((fraud, index) => (
            <div
              key={fraud.title}
              className="p-6 rounded-xl bg-card border border-destructive/20 hover:border-destructive/40 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <fraud.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{fraud.title}</h3>
              <p className="text-sm text-muted-foreground">{fraud.description}</p>
            </div>
          ))}
        </div>

        {/* Solution */}
        <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-center animate-fade-up animation-delay-700">
          <h3 className="text-xl md:text-2xl font-bold text-primary-foreground mb-4">
            Notre solution : une vérification certifiée
          </h3>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-6">
            SafeVerify analyse la cohérence entre <strong>l'identité</strong>, <strong>la réservation</strong> et 
            <strong> le compte bancaire</strong> pour attribuer un score de confiance fiable. 
            Protégez-vous avant l'arrivée du locataire.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/80">
            <span className="px-4 py-2 bg-primary-foreground/10 rounded-full">✓ Voyageurs protégés</span>
            <span className="px-4 py-2 bg-primary-foreground/10 rounded-full">✓ Propriétaires sécurisés</span>
            <span className="px-4 py-2 bg-primary-foreground/10 rounded-full">✓ Transactions vérifiées</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
