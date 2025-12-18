import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Target, Eye, Lock, Users, Heart, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Sécurité",
    description: "La protection de nos utilisateurs est notre priorité absolue.",
  },
  {
    icon: Eye,
    title: "Transparence",
    description: "Des processus clairs et une communication honnête à chaque étape.",
  },
  {
    icon: Lock,
    title: "Confidentialité",
    description: "Vos données sont protégées et traitées conformément au RGPD.",
  },
  {
    icon: Heart,
    title: "Confiance",
    description: "Nous construisons des relations durables basées sur la fiabilité.",
  },
];

const APropos = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6 animate-fade-up">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Notre mission</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-up animation-delay-100">
              Simplifier la confiance entre{" "}
              <span className="text-gradient-primary">propriétaires et locataires</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed animate-fade-up animation-delay-200">
              SafeVerify est né d'un constat simple : la fraude dans la location explose, 
              et propriétaires comme locataires méritent une solution fiable pour se protéger.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Problem */}
            <div className="animate-fade-up">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Le problème
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Le marché de la location courte et longue durée est fortement exposé à la fraude :
                </p>
                <ul className="space-y-3">
                  {[
                    "Usurpation d'identité de plus en plus sophistiquée",
                    "Faux profils et documents falsifiés",
                    "Réservations frauduleuses en hausse",
                    "Pertes financières et perte de confiance",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Solution */}
            <div className="animate-fade-up animation-delay-200">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Notre solution
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  SafeVerify offre un service de vérification complet et accessible :
                </p>
                <ul className="space-y-3">
                  {[
                    "Vérification de cohérence Personne / Réservation / Compte",
                    "Analyse basée sur les emails officiels (Airbnb, Booking...)",
                    "Score de confiance clair et actionnable",
                    "Profil locataire réutilisable et sécurisé",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Nos valeurs
            </h2>
            <p className="text-muted-foreground">
              Des principes qui guident chacune de nos décisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="text-center p-6 rounded-2xl bg-card border border-border animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Protect */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Qui protégeons-nous ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Propriétaires */}
            <div className="p-8 rounded-2xl bg-gradient-primary text-primary-foreground animate-fade-up">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Propriétaires & Conciergeries</h3>
              <ul className="space-y-3 text-primary-foreground/90">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Réduisez les risques de fraude jusqu'à 85%
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Gagnez du temps avec des vérifications automatisées
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Protégez votre bien et vos revenus
                </li>
              </ul>
            </div>

            {/* Locataires */}
            <div className="p-8 rounded-2xl bg-card border border-border animate-fade-up animation-delay-200">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Voyageurs & Locataires</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Prouvez votre fiabilité en quelques clics
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Profil réutilisable pour toutes vos locations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  Aucun frais à votre charge
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* RGPD Compliance */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              100% conforme RGPD
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
              La protection de vos données personnelles est au cœur de notre technologie. 
              SafeVerify respecte scrupuleusement la réglementation européenne sur la 
              protection des données (RGPD).
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Données chiffrées", "Droit à l'oubli", "Consentement explicite", "Hébergement EU"].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-primary-foreground/10 text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Prêt à nous rejoindre ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Rejoignez les milliers de propriétaires qui font confiance à SafeVerify 
            pour sécuriser leurs locations.
          </p>
          <Button variant="hero" size="xl">
            Commencer maintenant
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default APropos;
