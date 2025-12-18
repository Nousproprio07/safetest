import { UserCheck, Link2, MessageSquare, ShieldCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserCheck,
    title: "Propriétaire vérifié",
    description: "Créez votre compte et authentifiez-vous. Vos biens immobiliers sont enregistrés et vérifiés.",
  },
  {
    number: "02",
    icon: Link2,
    title: "Connexion simplifiée",
    description: "Reliez votre plateforme de location (Airbnb, Booking) à SafeVerify en quelques clics.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Message automatique",
    description: "À chaque réservation, un lien SafeVerify est envoyé automatiquement au voyageur via la plateforme.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Voyageur vérifié",
    description: "Le voyageur saisit le code logement et son ID de réservation. Une fois validé, il est vérifié pour un an.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Comment ça <span className="text-gradient-primary">fonctionne</span> ?
          </h2>
          <p className="text-muted-foreground text-lg">
            Un processus simple et rapide pour sécuriser vos locations.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connector Line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-border" />
              )}

              <div className="relative bg-card rounded-2xl p-6 border border-border shadow-card">
                {/* Number Badge */}
                <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-primary text-primary-foreground text-sm font-bold rounded-full">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 mt-2">
                  <step.icon className="w-7 h-7 text-accent" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
