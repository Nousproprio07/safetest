import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tarifs from "./pages/Tarifs";
import APropos from "./pages/APropos";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import RechargerCredits from "./pages/RechargerCredits";
import ChangerPack from "./pages/ChangerPack";
import Abonnement from "./pages/Abonnement";
import NotFound from "./pages/NotFound";
// Conciergerie pages
import ConciergerieAuth from "./pages/ConciergerieAuth";
import ConciergerieDashboard from "./pages/ConciergerieDashboard";
// Locataire pages
import LocataireVerification from "./pages/LocataireVerification";
import LocataireCompte from "./pages/LocataireCompte";
import LocataireGererDonnees from "./pages/LocataireGererDonnees";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recharger-credits" element={<RechargerCredits />} />
          <Route path="/changer-pack" element={<ChangerPack />} />
          <Route path="/abonnement" element={<Abonnement />} />
          {/* Conciergerie routes */}
          <Route path="/conciergerie/auth" element={<ConciergerieAuth />} />
          <Route path="/conciergerie/dashboard" element={<ConciergerieDashboard />} />
          {/* Locataire routes */}
          <Route path="/verification" element={<LocataireVerification />} />
          <Route path="/locataire/compte" element={<LocataireCompte />} />
          <Route path="/locataire/gerer-donnees" element={<LocataireGererDonnees />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
