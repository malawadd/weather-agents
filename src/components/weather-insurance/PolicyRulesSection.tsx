import React from 'react';
import { PolicyDetail } from '../../data/mockInsuranceData';

interface PolicyRulesSectionProps {
  policy: PolicyDetail;
}

export function PolicyRulesSection({ policy }: PolicyRulesSectionProps) {
  return (
    <div className="nb-betting-panel-white p-6">
      <h2 className="text-xl font-bold mb-4">📋 Policy Terms Summary</h2>
      
      <div className="space-y-4">
        <div className="nb-betting-panel-accent p-4">
          <h3 className="font-bold mb-2">Payout Criteria</h3>
          <p className="text-sm">{policy.termsSummary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="nb-betting-panel p-3">
            <h4 className="font-bold text-sm mb-1">Data Source</h4>
            <p className="text-sm">WeatherXM</p>
          </div>
          <div className="nb-betting-panel p-3">
            <h4 className="font-bold text-sm mb-1">Verification</h4>
            <p className="text-sm">{policy.verificationMethod}</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button className="nb-betting-button-accent px-4 py-2 font-bold text-sm">
            📖 View Full Terms
          </button>
          <button className="nb-betting-button px-4 py-2 font-bold text-sm">
            ❓ Help Center
          </button>
        </div>

        <div className="nb-betting-panel-warning p-3">
          <p className="text-xs font-bold">
            ⚠️ Important: Weather insurance payouts are based on parametric triggers. While checking multiple weather sources 
            may help guide your decision, the official and final value used to determine policy payouts is the data 
            reported by the {policy.dataSource}.
          </p>
        </div>
      </div>
    </div>
  );
}