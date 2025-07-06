import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TradingDashboard } from './TradingDashboard';
import { CreateAgentPage } from './pages/CreateAgentPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { MyAgentsPage } from './pages/MyAgentsPage';
import { StationsListPage } from './pages/StationsListPage';
import { MyStationsPage } from './pages/MyStationsPage';
import { StationDetailPage } from './pages/StationDetailPage';
import { useAuth } from './WalletAuthProvider';
import { api } from '../convex/_generated/api';

export function AuthenticatedApp() {
  const { isGuest } = useAuth();
  const initializeDemoData = useMutation(api.demoData.initializeDemoData);

  // Initialize demo data when app loads (for guest users)
  useEffect(() => {
    if (isGuest) {
      initializeDemoData({}).catch(console.error);
    }
  }, [isGuest, initializeDemoData]);

  return (
    <Routes>
      {/* Weather Intelligence Platform Routes */}
      <Route path="/" element={<TradingDashboard />} />
      <Route path="/create-agent" element={<CreateAgentPage />} />
      <Route path="/agent/:id" element={<AgentDetailPage />} />
      <Route path="/my-agents" element={<MyAgentsPage />} />
      <Route path="/stations" element={<StationsListPage />} />
      <Route path="/my-stations" element={<MyStationsPage />} />
      <Route path="/station/:stationId" element={<StationDetailPage />} />
      <Route path="*" element={<Navigate to="/weather-intelligence" replace />} />
    </Routes>
  );
}