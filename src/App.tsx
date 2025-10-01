import { Toaster } from "sonner";
import { TomoProvider } from "./TomoProvider";
import { AuthProvider, useAuth } from "./WalletAuthProvider";
import { WalletSignInForm } from "./WalletSignInForm";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { PlatformSelectionPage } from "./pages/PlatformSelectionPage";
import { PlaceholderPlatformPage } from "./pages/PlaceholderPlatformPage";
import { WeatherInsurancePlatformLayout } from "./layouts/WeatherInsurancePlatformLayout";
import { AuthenticatedApp } from "./AuthenticatedApp";

import { ActiveBidsPage } from "./pages/ActiveBidsPage";
import { BidPage } from "./pages/BidPage";
import { CreateBidPage } from "./pages/CreateBidPage";
function AppRouterContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Allow platform selection page for everyone
  if (!isAuthenticated && location.pathname !== "/platform-selection") {
    return <WalletSignInForm />;
  }

  return (
    <Routes>
      {/* Root redirect to platform selection */}
      <Route path="/" element={<Navigate to="/platform-selection" replace />} />
      
      {/* Platform Selection */}
      <Route path="/platform-selection" element={<PlatformSelectionPage />} />
      
      {/* Weather Intelligence Platform */}
      <Route path="/weather-intelligence/*" element={<AuthenticatedApp />} />
      
      {/* Weather Insurance Platform */}
      <Route path="/weather-insurance/*" element={<WeatherInsurancePlatformLayout />} />
      
      {/* Future Platform (placeholder) */}
      <Route path="/future-platform/*" element={<PlaceholderPlatformPage />} />
      
      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/platform-selection" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <TomoProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <AppRouterContent />
            <Toaster />
          </div>
        </AuthProvider>
      </TomoProvider>
    </Router>
  );
}