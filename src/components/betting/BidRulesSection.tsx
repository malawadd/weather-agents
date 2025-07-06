import React from 'react';
import { BidDetail } from '../../data/mockBettingData';

interface BidRulesSectionProps {
  bid: BidDetail;
}

export function BidRulesSection({ bid }: BidRulesSectionProps) {
  return (
    <div className="nb-betting-panel-white p-6">
      <h2 className="text-xl font-bold mb-4">📋 Rules Summary</h2>
      
      <div className="space-y-4">
        <div className="nb-betting-panel-accent p-4">
          <h3 className="font-bold mb-2">Resolution Criteria</h3>
          <p className="text-sm">{bid.rulesSummary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="nb-betting-panel p-3">
            <h4 className="font-bold text-sm mb-1">Data Source</h4>
            <p className="text-sm">{bid.dataSource}</p>
          </div>
          <div className="nb-betting-panel p-3">
            <h4 className="font-bold text-sm mb-1">Verification</h4>
            <p className="text-sm">{bid.verificationMethod}</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button className="nb-betting-button-accent px-4 py-2 font-bold text-sm">
            📖 View Full Rules
          </button>
          <button className="nb-betting-button px-4 py-2 font-bold text-sm">
            ❓ Help Center
          </button>
        </div>

        <div className="nb-betting-panel-warning p-3">
          <p className="text-xs font-bold">
            ⚠️ Important: Not all weather data is the same. While checking a source like AccuWeather 
            or Google Weather may help guide your decision, the official and final value used to 
            determine this market is the highest temperature as reported by the {bid.dataSource}.
          </p>
        </div>
      </div>
    </div>
  );
}