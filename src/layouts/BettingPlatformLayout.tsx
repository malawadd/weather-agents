import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BettingHeader } from '../components/betting/BettingHeader';
import { BettingFooter } from '../components/betting/BettingFooter';
import { ActiveBidsPage } from '../pages/betting/ActiveBidsPage';
import { BidDetailPage } from '../pages/betting/BidDetailPage';
import { VaultPage } from '../pages/betting/VaultPage';

export function BettingPlatformLayout() {
  return (
    <div className="min-h-screen nb-betting-grid-bg flex flex-col">
      <BettingHeader />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ActiveBidsPage />} />
          <Route path="/bid/:bidId" element={<BidDetailPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="*" element={<Navigate to="/weather-betting" replace />} />
        </Routes>
      </main>
      
      <BettingFooter />
    </div>
  );
}