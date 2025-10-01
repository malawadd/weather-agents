import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WeatherInsuranceHeader } from '../components/weather-insurance/WeatherInsuranceHeader';
import { WeatherInsuranceFooter } from '../components/weather-insurance/WeatherInsuranceFooter';
import { InsuranceLandingPage } from '../pages/weather-insurance/InsuranceLandingPage';
import { ActivePoliciesPage } from '../pages/weather-insurance/ActivePoliciesPage';
import { PolicyDetailPage } from '../pages/weather-insurance/PolicyDetailPage';
import { CreatePolicyPage } from '../pages/weather-insurance/CreatePolicyPage';
import { PremiumVaultPage } from '../pages/weather-insurance/PremiumVaultPage';

export function WeatherInsurancePlatformLayout() {
  return (
    <div className="min-h-screen nb-insurance-grid-bg flex flex-col">
      <WeatherInsuranceHeader />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<InsuranceLandingPage />} />
          <Route path="/policies" element={<ActivePoliciesPage />} />
          <Route path="/policy/:policyId" element={<PolicyDetailPage />} />
          <Route path="/create-policy" element={<CreatePolicyPage />} />
          <Route path="/premium-vault" element={<PremiumVaultPage />} />
          <Route path="*" element={<Navigate to="/weather-insurance" replace />} />
        </Routes>
      </main>
      
      <WeatherInsuranceFooter />
    </div>
  );
}