import { ShieldCheck, Users, Building2, TrendingDown } from "lucide-react";

const stats = [
  {
    icon: ShieldCheck,
    value: "99.2%",
    label: "Taux de détection",
    description: "des fraudes identifiées",
  },
  {
    icon: Users,
    value: "50K+",
    label: "Vérifications",
    description: "réalisées avec succès",
  },
  {
    icon: Building2,
    value: "2,500+",
    label: "Propriétaires",
    description: "nous font confiance",
  },
  {
    icon: TrendingDown,
    value: "-85%",
    label: "Litiges",
    description: "en moyenne constatés",
  },
];

const TrustSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-primary text-primary-foreground">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            La confiance en chiffres
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Des résultats concrets pour une protection maximale.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-primary-foreground/90 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-primary-foreground/60">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
