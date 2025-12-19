import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Home, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Phone, 
  FileCheck, 
  CreditCard,
  MapPin,
  User,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Mock property data
const mockProperty = {
  id: "p1",
  name: "Studio Marais",
  description: "Charmant studio au cœur du Marais parisien",
  photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600"],
  ownerName: "Jean",
  ownerFirstName: "Dupont",
  location: "Paris, France",
};

type VerificationStep = "code" | "contact" | "otp_email" | "otp_sms" | "kyc" | "truelayer" | "complete" | "already_verified";

const LocataireVerification = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<VerificationStep>("code");
  const [isLoading, setIsLoading] = useState(false);
  
  // Code step
  const [propertyCode, setPropertyCode] = useState("");
  const [reservationId, setReservationId] = useState("");
  
  // Contact step
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // OTP step
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSms, setOtpSms] = useState("");
  
  // Progress state (simulates backend state)
  const [progressState, setProgressState] = useState({
    otpDone: false,
    kycDone: false,
    truelayerDone: false,
    truelayerRequired: true, // Could be false based on owner settings
  });

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate checking reservation
    if (propertyCode === "ALREADY" && reservationId === "123") {
      // Already verified case
      setStep("already_verified");
    } else if (propertyCode === "RESUME" && reservationId === "123") {
      // Resume case - OTP already done
      setProgressState(prev => ({ ...prev, otpDone: true }));
      toast({
        title: "Reprise de vérification",
        description: "Vos OTP sont déjà validés. Passage au KYC.",
      });
      setStep("kyc");
    } else {
      // New verification
      toast({
        title: "Réservation trouvée",
        description: "Un crédit de vérification a été réservé pour vous.",
      });
      setStep("contact");
    }
    
    setIsLoading(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate ZeroBounce + Twilio Lookup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Codes envoyés",
      description: "Vérifiez votre email et votre téléphone.",
    });
    
    setStep("otp_email");
    setIsLoading(false);
  };

  const handleOtpEmailSubmit = async () => {
    if (otpEmail.length < 6) return;
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Email vérifié",
      description: "Passons à la vérification SMS.",
    });
    
    setStep("otp_sms");
    setIsLoading(false);
  };

  const handleOtpSmsSubmit = async () => {
    if (otpSms.length < 6) return;
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProgressState(prev => ({ ...prev, otpDone: true }));
    
    toast({
      title: "Téléphone vérifié",
      description: "Passons à la vérification d'identité.",
    });
    
    setStep("kyc");
    setIsLoading(false);
  };

  const handleKycSubmit = async () => {
    setIsLoading(true);
    
    // Simulate Stripe Identity
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setProgressState(prev => ({ ...prev, kycDone: true }));
    
    if (progressState.truelayerRequired) {
      toast({
        title: "Identité vérifiée",
        description: "Dernière étape : vérification bancaire.",
      });
      setStep("truelayer");
    } else {
      setStep("complete");
    }
    
    setIsLoading(false);
  };

  const handleTruelayerSubmit = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProgressState(prev => ({ ...prev, truelayerDone: true }));
    setStep("complete");
    setIsLoading(false);
  };

  // Render functions for each step
  const renderCodeStep = () => (
    <Card className="border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          Vérification de réservation
        </CardTitle>
        <CardDescription>
          Entrez le code logement et l'ID de réservation reçus dans votre message
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property-code">Code logement</Label>
            <Input
              id="property-code"
              placeholder="Ex: ABC123"
              value={propertyCode}
              onChange={(e) => setPropertyCode(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reservation-id">ID de réservation</Label>
            <Input
              id="reservation-id"
              placeholder="Ex: HMAK123456"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                Continuer
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-4">
          💡 Testez avec "ALREADY" + "123" pour voir le cas déjà vérifié
        </p>
      </CardContent>
    </Card>
  );

  const renderContactStep = () => (
    <Card className="border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Vos coordonnées
        </CardTitle>
        <CardDescription>
          Nous allons vérifier votre email et numéro de téléphone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Vérification ZeroBounce & Twilio...
              </>
            ) : (
              <>
                Envoyer les codes
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderOtpEmailStep = () => (
    <Card className="border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Code email
        </CardTitle>
        <CardDescription>
          Entrez le code à 6 chiffres reçu par email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otpEmail} onChange={setOtpEmail}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button 
          onClick={handleOtpEmailSubmit} 
          className="w-full" 
          disabled={isLoading || otpEmail.length < 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Vérification...
            </>
          ) : (
            "Valider le code email"
          )}
        </Button>
        <button className="text-sm text-primary hover:underline w-full text-center">
          Renvoyer le code
        </button>
      </CardContent>
    </Card>
  );

  const renderOtpSmsStep = () => (
    <Card className="border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          Code SMS
        </CardTitle>
        <CardDescription>
          Entrez le code à 6 chiffres reçu par SMS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otpSms} onChange={setOtpSms}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button 
          onClick={handleOtpSmsSubmit} 
          className="w-full" 
          disabled={isLoading || otpSms.length < 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Vérification...
            </>
          ) : (
            "Valider le code SMS"
          )}
        </Button>
        <button className="text-sm text-primary hover:underline w-full text-center">
          Renvoyer le code
        </button>
      </CardContent>
    </Card>
  );

  const renderKycStep = () => (
    <Card className="border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Vérification d'identité
        </CardTitle>
        <CardDescription>
          Nous allons vérifier votre pièce d'identité via Stripe Identity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <FileCheck className="h-12 w-12 mx-auto mb-3 text-primary" />
          <p className="text-sm text-muted-foreground">
            Préparez votre pièce d'identité et assurez-vous d'être dans un endroit bien éclairé.
          </p>
        </div>
        <Button onClick={handleKycSubmit} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Vérification en cours...
            </>
          ) : (
            "Démarrer la vérification KYC"
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderTruelayerStep = () => (
    <Card className="border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Vérification bancaire
        </CardTitle>
        <CardDescription>
          Dernière étape : confirmez que vous possédez un compte bancaire à votre nom
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <CreditCard className="h-12 w-12 mx-auto mb-3 text-primary" />
          <p className="text-sm text-muted-foreground">
            Connexion sécurisée via TrueLayer. Nous ne conservons aucune donnée bancaire.
          </p>
        </div>
        <Button onClick={handleTruelayerSubmit} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            "Connecter mon compte bancaire"
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderCompleteStep = () => (
    <Card className="border-border/50 shadow-xl border-green-200">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-green-800">Identité vérifiée !</CardTitle>
        <CardDescription>
          Votre vérification pour cette réservation est complète
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Owner info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Informations du propriétaire</h4>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{mockProperty.ownerFirstName} {mockProperty.ownerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{mockProperty.location}</span>
          </div>
        </div>

        {/* Create account CTA */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-sm mb-2">Créer votre compte SafeVerify</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Retrouvez vos vérifications, mettez à jour vos coordonnées, et gérez vos données.
          </p>
          <Button asChild className="w-full" size="sm">
            <Link to="/locataire/compte">Créer mon compte</Link>
          </Button>
        </div>

        <Button variant="outline" asChild className="w-full">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </CardContent>
    </Card>
  );

  const renderAlreadyVerifiedStep = () => (
    <Card className="border-border/50 shadow-xl border-green-200">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-green-800">Déjà vérifié !</CardTitle>
        <CardDescription>
          Vous êtes déjà vérifié pour cette réservation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Owner info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Informations du propriétaire</h4>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{mockProperty.ownerFirstName} {mockProperty.ownerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{mockProperty.location}</span>
          </div>
        </div>

        <Button variant="outline" asChild className="w-full">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </CardContent>
    </Card>
  );

  // Progress indicator
  const renderProgress = () => {
    const steps = [
      { key: "code", label: "Code", done: step !== "code" },
      { key: "contact", label: "Contact", done: progressState.otpDone },
      { key: "kyc", label: "KYC", done: progressState.kycDone },
      ...(progressState.truelayerRequired ? [{ key: "bank", label: "Banque", done: progressState.truelayerDone }] : []),
    ];

    if (step === "already_verified" || step === "complete") return null;

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              s.done ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
            }`}>
              {s.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-xs hidden sm:inline">{s.label}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à l'accueil</span>
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Property info */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">SafeVerify</span>
            </div>
            
            {step !== "code" && step !== "already_verified" && (
              <div className="mt-4">
                <img 
                  src={mockProperty.photos[0]} 
                  alt={mockProperty.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h2 className="font-semibold">{mockProperty.name}</h2>
                <p className="text-sm text-muted-foreground">{mockProperty.description}</p>
              </div>
            )}
          </div>

          {/* Progress */}
          {renderProgress()}

          {/* Step content */}
          {step === "code" && renderCodeStep()}
          {step === "contact" && renderContactStep()}
          {step === "otp_email" && renderOtpEmailStep()}
          {step === "otp_sms" && renderOtpSmsStep()}
          {step === "kyc" && renderKycStep()}
          {step === "truelayer" && renderTruelayerStep()}
          {step === "complete" && renderCompleteStep()}
          {step === "already_verified" && renderAlreadyVerifiedStep()}

          {/* Security notice */}
          {step !== "complete" && step !== "already_verified" && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <h4 className="font-semibold text-sm mb-2">🛡️ Vérification sécurisée</h4>
              <p className="text-xs text-muted-foreground">
                Vos données sont protégées et utilisées uniquement pour vérifier votre identité auprès du propriétaire.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocataireVerification;
