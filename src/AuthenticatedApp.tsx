import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WeatherIntelligenceLayout } from './layouts/WeatherIntelligenceLayout';
import { WeatherIntelligenceDashboard } from './WeatherIntelligenceDashboard';
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
      <Route path="/" element={<WeatherIntelligenceLayout />}>
        {/* Weather Intelligence Platform Routes */}
        <Route index element={<WeatherIntelligenceDashboard />} />
        <Route path="stations" element={<StationsListPage />} />
        <Route path="my-stations" element={<MyStationsPage />} />
        <Route path="station/:stationId" element={<StationDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/weather-intelligence" replace />} />
    </Routes>
  );
}