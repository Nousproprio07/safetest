import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Mail, Phone, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Step = "contact" | "otp_email" | "otp_sms" | "account";

const LocataireGererDonnees = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("contact");
  const [isLoading, setIsLoading] = useState(false);
  
  // Contact step
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // OTP step
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSms, setOtpSms] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
    
    toast({
      title: "Identité confirmée",
      description: "Vous pouvez maintenant gérer vos données.",
    });
    
    // Navigate to the account page
    navigate("/locataire/compte");
    setIsLoading(false);
  };

  const renderContactStep = () => (
    <Card className="border-border/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Vos coordonnées
        </CardTitle>
        <CardDescription>
          Entrez l'email et le téléphone utilisés lors de votre vérification
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
                Envoi des codes...
              </>
            ) : (
              <>
                Recevoir les codes de vérification
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
            "Accéder à mes données"
          )}
        </Button>
        <button className="text-sm text-primary hover:underline w-full text-center">
          Renvoyer le code
        </button>
      </CardContent>
    </Card>
  );

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
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Shield className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold text-foreground">SafeVerify</span>
            </div>
            <p className="text-muted-foreground">
              Gérer mes données personnelles
            </p>
          </div>

          {/* Step content */}
          {step === "contact" && renderContactStep()}
          {step === "otp_email" && renderOtpEmailStep()}
          {step === "otp_sms" && renderOtpSmsStep()}

          {/* Info notice */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
            <h4 className="font-semibold text-sm mb-2">🔒 Vérification requise</h4>
            <p className="text-xs text-muted-foreground">
              Pour accéder à vos données, nous devons vérifier votre identité via OTP email et SMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocataireGererDonnees;
