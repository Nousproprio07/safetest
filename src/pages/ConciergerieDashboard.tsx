import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Home, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  Eye,
  Calendar,
  User,
  Flag,
  Building2,
  ChevronUp,
  AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock data for property owners (clients)
const mockClients = [
  { id: "1", name: "Jean Dupont", email: "jean.dupont@email.com", propertiesCount: 3, canReport: true },
  { id: "2", name: "Marie Martin", email: "marie.martin@email.com", propertiesCount: 2, canReport: false },
  { id: "3", name: "Pierre Bernard", email: "pierre.bernard@email.com", propertiesCount: 5, canReport: true },
];

// Mock data for properties per client
const mockProperties: Record<string, Array<{
  id: string;
  name: string;
  address: string;
  verificationsCount: number;
}>> = {
  "1": [
    { id: "p1", name: "Studio Marais", address: "12 Rue des Archives, Paris", verificationsCount: 8 },
    { id: "p2", name: "Appartement Bastille", address: "45 Rue de la Roquette, Paris", verificationsCount: 12 },
    { id: "p3", name: "Loft Oberkampf", address: "78 Rue Oberkampf, Paris", verificationsCount: 5 },
  ],
  "2": [
    { id: "p4", name: "Maison Nice Centre", address: "23 Rue de France, Nice", verificationsCount: 15 },
    { id: "p5", name: "Villa Cannes", address: "8 Boulevard Carnot, Cannes", verificationsCount: 20 },
  ],
  "3": [
    { id: "p6", name: "Studio Lyon", address: "5 Rue de la République, Lyon", verificationsCount: 6 },
    { id: "p7", name: "Appartement Bordeaux", address: "12 Cours de l'Intendance, Bordeaux", verificationsCount: 9 },
    { id: "p8", name: "Maison Marseille", address: "34 Rue Paradis, Marseille", verificationsCount: 11 },
    { id: "p9", name: "Studio Toulouse", address: "67 Rue Alsace Lorraine, Toulouse", verificationsCount: 4 },
    { id: "p10", name: "Loft Nantes", address: "89 Rue Crébillon, Nantes", verificationsCount: 7 },
  ],
};

// Mock verifications per property with fraud detection
const mockVerifications: Record<string, Array<{
  id: string;
  guestName: string;
  guestFirstName: string;
  checkIn: string;
  checkOut: string;
  status: "verified" | "pending" | "fraud_detected";
  fraudReason?: string;
}>> = {
  "p1": [
    { id: "v1", guestName: "Smith", guestFirstName: "John", checkIn: "2024-01-15", checkOut: "2024-01-20", status: "verified" },
    { id: "v2", guestName: "Johnson", guestFirstName: "Emily", checkIn: "2024-01-22", checkOut: "2024-01-25", status: "fraud_detected", fraudReason: "Document d'identité falsifié" },
  ],
  "p2": [
    { id: "v3", guestName: "Williams", guestFirstName: "Michael", checkIn: "2024-01-10", checkOut: "2024-01-14", status: "verified" },
    { id: "v4", guestName: "Brown", guestFirstName: "Sarah", checkIn: "2024-01-16", checkOut: "2024-01-19", status: "pending" },
  ],
  "p3": [
    { id: "v5", guestName: "Davis", guestFirstName: "Robert", checkIn: "2024-01-08", checkOut: "2024-01-12", status: "fraud_detected", fraudReason: "Photos trouvées sur d'autres annonces" },
  ],
  "p4": [
    { id: "v6", guestName: "Garcia", guestFirstName: "Maria", checkIn: "2024-01-20", checkOut: "2024-01-27", status: "verified" },
  ],
  "p5": [
    { id: "v7", guestName: "Miller", guestFirstName: "James", checkIn: "2024-01-05", checkOut: "2024-01-10", status: "verified" },
  ],
};

const ConciergerieDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [expandedPropertyMobile, setExpandedPropertyMobile] = useState<string | null>(null);

  const clientProperties = mockProperties[selectedClient.id] || [];
  const selectedPropertyData = clientProperties.find(p => p.id === selectedProperty);
  const propertyVerifications = selectedProperty ? (mockVerifications[selectedProperty] || []) : [];

  const statusConfig = {
    verified: { color: "text-green-600", bg: "bg-green-100", label: "Vérifié" },
    pending: { color: "text-yellow-600", bg: "bg-yellow-100", label: "En attente" },
    fraud_detected: { color: "text-red-600", bg: "bg-red-100", label: "Fraude détectée" },
  };

  // Get all fraud alerts across all properties for this client
  const fraudAlerts = clientProperties.flatMap(property => {
    const verifications = mockVerifications[property.id] || [];
    return verifications
      .filter(v => v.status === "fraud_detected")
      .map(v => ({ ...v, propertyName: property.name, propertyId: property.id }));
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold">SafeVerify</span>
            <Badge variant="secondary" className="ml-2 text-xs">Conciergerie</Badge>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border bg-card px-4 py-3 space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
              <Link to="/">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Link>
            </Button>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Client switcher */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Tableau de bord Conciergerie</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Accès en lecture seule aux biens et vérifications de vos clients
              </p>
            </div>
            
            {/* Client dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{selectedClient.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {mockClients.map((client) => (
                  <DropdownMenuItem 
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setSelectedProperty(null);
                    }}
                    className="flex items-center justify-between"
                  >
                    <span>{client.name}</span>
                    {client.id === selectedClient.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Read-only notice */}
        <Card className="mb-6 border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Mode lecture seule</p>
                <p className="text-xs text-blue-700">
                  Vous pouvez consulter les biens et vérifications mais pas les modifier.
                  {selectedClient.canReport && " Signalement de fraude activé par ce propriétaire."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fraud Alerts Section for Concierge */}
        {fraudAlerts.length > 0 && (
          <Card className="mb-6 border-red-300 bg-red-50/80 shadow-lg">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-red-700">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 animate-pulse" />
                Alertes fraude - {selectedClient.name}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-red-600">
                {fraudAlerts.length} fraude(s) détectée(s) sur les biens de ce client
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-3">
                {fraudAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white rounded-lg border border-red-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="destructive" className="text-xs">
                            <Home className="h-3 w-3 mr-1" />
                            {alert.propertyName}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                            <User className="h-3 w-3 mr-1" />
                            {alert.guestFirstName} {alert.guestName}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-red-700 mt-1 font-medium">
                          {alert.fraudReason}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{alert.checkIn} → {alert.checkOut}</span>
                        </div>
                      </div>
                    </div>
                    {selectedClient.canReport && (
                      <Button size="sm" variant="destructive" className="w-full sm:w-auto">
                        <Flag className="h-4 w-4 mr-2" />
                        Signaler
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Properties list */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Biens de {selectedClient.name}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {clientProperties.length} bien(s) enregistré(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="space-y-2">
                  {clientProperties.map((property) => {
                    const verifications = mockVerifications[property.id] || [];
                    const isExpanded = expandedPropertyMobile === property.id;
                    
                    return (
                      <div key={property.id}>
                        {/* Desktop: simple button to select */}
                        <button
                          onClick={() => {
                            // Desktop: select property for right panel
                            setSelectedProperty(property.id);
                            // Mobile: toggle accordion
                            setExpandedPropertyMobile(isExpanded ? null : property.id);
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            selectedProperty === property.id || isExpanded
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{property.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">{property.address}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {property.verificationsCount} vérifications
                              </div>
                            </div>
                            {/* Mobile accordion indicator */}
                            <div className="lg:hidden ml-2">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </button>
                        
                        {/* Mobile: inline verifications accordion */}
                        {isExpanded && (
                          <div className="lg:hidden mt-2 ml-2 pl-3 border-l-2 border-primary/30 space-y-2 animate-in slide-in-from-top-2 duration-200">
                            {selectedClient.canReport && (
                              <Button variant="outline" size="sm" className="w-full text-red-600 border-red-200 hover:bg-red-50 mb-2">
                                <Flag className="h-4 w-4 mr-2" />
                                Signaler une fraude
                              </Button>
                            )}
                            {verifications.length === 0 ? (
                              <div className="text-center py-4 text-muted-foreground">
                                <p className="text-xs">Aucune vérification pour ce bien</p>
                              </div>
                            ) : (
                              verifications.map((verification) => {
                                const config = statusConfig[verification.status];
                                return (
                                  <div
                                    key={verification.id}
                                    className="p-3 rounded-lg border border-border bg-card"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}>
                                        <User className={`h-4 w-4 ${config.color}`} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">
                                          {verification.guestFirstName} {verification.guestName}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                          <Calendar className="h-3 w-3" />
                                          <span>{verification.checkIn} → {verification.checkOut}</span>
                                        </div>
                                      </div>
                                      <Badge variant="secondary" className={`${config.bg} ${config.color} border-0 text-xs shrink-0`}>
                                        {config.label}
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verifications list - Desktop only */}
          <div className="hidden lg:block lg:col-span-2">
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg">
                      {selectedPropertyData 
                        ? `Vérifications - ${selectedPropertyData.name}` 
                        : "Sélectionnez un bien"}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Historique des vérifications voyageurs
                    </CardDescription>
                  </div>
                  {selectedClient.canReport && selectedProperty && (
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Flag className="h-4 w-4 mr-2" />
                      Signaler une fraude
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                {!selectedProperty ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Sélectionnez un bien pour voir les vérifications</p>
                  </div>
                ) : propertyVerifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Aucune vérification pour ce bien</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {propertyVerifications.map((verification) => {
                      const config = statusConfig[verification.status];
                      return (
                        <div
                          key={verification.id}
                          className="p-4 rounded-lg border border-border hover:shadow-sm transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
                                <User className={`h-5 w-5 ${config.color}`} />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {verification.guestFirstName} {verification.guestName}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{verification.checkIn} → {verification.checkOut}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className={`${config.bg} ${config.color} border-0`}>
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConciergerieDashboard;
