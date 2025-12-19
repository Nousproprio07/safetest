import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, Shield, ArrowLeft, Home, Building2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UserRole = "proprietaire" | "conciergerie" | "voyageur";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<UserRole>("proprietaire");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("proprietaire");

  const getRoleRedirect = (role: UserRole) => {
    switch (role) {
      case "conciergerie":
        return "/conciergerie/dashboard";
      case "voyageur":
        return "/locataire/compte";
      default:
        return "/dashboard";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "conciergerie":
        return "Conciergerie";
      case "voyageur":
        return "Voyageur";
      default:
        return "Propriétaire / Hôte";
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate IP verification with FraudLabs Pro
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Connexion réussie",
      description: `Bienvenue sur SafeVerify en tant que ${getRoleLabel(loginRole)} !`,
    });
    
    setIsLoading(false);
    navigate(getRoleRedirect(loginRole));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate IP evaluation with FraudLabs Pro
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Inscription réussie",
      description: `Compte ${getRoleLabel(signupRole)} créé. Un email de confirmation a été envoyé.`,
    });
    
    setIsLoading(false);
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
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Shield className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold text-foreground">SafeVerify</span>
            </div>
            <p className="text-muted-foreground">
              Connexion à votre espace
            </p>
          </div>

          <Card className="border-border/50 shadow-xl">
            <Tabs defaultValue="login" className="w-full">
              <CardHeader className="pb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="signup">Inscription</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                {/* Login Tab */}
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Role Selection */}
                    <div className="space-y-3">
                      <Label>Type de compte</Label>
                      <RadioGroup
                        value={loginRole}
                        onValueChange={(value) => setLoginRole(value as UserRole)}
                        className="grid grid-cols-3 gap-2"
                      >
                        <div>
                          <RadioGroupItem
                            value="proprietaire"
                            id="login-proprietaire"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="login-proprietaire"
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Home className="mb-1 h-5 w-5" />
                            <span className="text-xs">Propriétaire</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="conciergerie"
                            id="login-conciergerie"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="login-conciergerie"
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Building2 className="mb-1 h-5 w-5" />
                            <span className="text-xs">Conciergerie</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="voyageur"
                            id="login-voyageur"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="login-voyageur"
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <User className="mb-1 h-5 w-5" />
                            <span className="text-xs">Voyageur</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <button type="button" className="text-sm text-primary hover:underline">
                        Mot de passe oublié ?
                      </button>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Vérification IP en cours...
                        </>
                      ) : (
                        "Se connecter"
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      🔒 Votre IP est vérifiée par FraudLabs Pro pour votre sécurité
                    </p>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignup} className="space-y-4">
                    {/* Role Selection */}
                    <div className="space-y-3">
                      <Label>Je suis un(e)</Label>
                      <RadioGroup
                        value={signupRole}
                        onValueChange={(value) => setSignupRole(value as UserRole)}
                        className="grid grid-cols-3 gap-2"
                      >
                        <div>
                          <RadioGroupItem
                            value="proprietaire"
                            id="signup-proprietaire"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="signup-proprietaire"
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Home className="mb-1 h-5 w-5" />
                            <span className="text-xs">Propriétaire</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="conciergerie"
                            id="signup-conciergerie"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="signup-conciergerie"
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <Building2 className="mb-1 h-5 w-5" />
                            <span className="text-xs">Conciergerie</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="voyageur"
                            id="signup-voyageur"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="signup-voyageur"
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <User className="mb-1 h-5 w-5" />
                            <span className="text-xs">Voyageur</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirmer le mot de passe</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Évaluation IP en cours...
                        </>
                      ) : (
                        "S'inscrire"
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground mt-4">
                      🔒 Votre IP sera évaluée et ajoutée à votre whitelist si valide
                    </p>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Security notice */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
            <h4 className="font-semibold text-sm mb-2">🛡️ Sécurité renforcée</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Vérification IP à chaque connexion</li>
              <li>• Email de confirmation obligatoire</li>
              <li>• Authentification TOTP disponible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
