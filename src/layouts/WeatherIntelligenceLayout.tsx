import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../WalletAuthProvider';
import { AppNavigation } from '../components/navigation/AppNavigation';

export function WeatherIntelligenceLayout() {
  const { user, isGuest, signOut } = useAuth();

  return (
    <div className="min-h-screen nb-grid-bg">
      <AppNavigation 
        user={user} 
        isGuest={isGuest} 
        signOut={signOut}
      />
      <Outlet />
    </div>
  );
}