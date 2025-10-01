import React from 'react';
import { PolicyDetail } from '../../data/mockInsuranceData';
import { PolicyOption } from './PolicyOption';

interface PolicyDetailsSectionProps {
  policy: PolicyDetail;
}

export function PolicyDetailsSection({ policy }: PolicyDetailsSectionProps) {
  const formatCoverage = (coverage: number) => {
    if (coverage >= 1000000) {
      return `$${(coverage / 1000000).toFixed(3)}M`;
    }
    return `$${coverage.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="nb-betting-panel-white p-6">
        <div className="flex items-start space-x-6">
          <img 
            src={policy.image} 
            alt={policy.question}
            className="w-24 h-24 object-cover rounded border-4 border-black"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{policy.question}</h1>
            <p className="text-gray-600 mb-2">{policy.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="nb-betting-panel-accent px-2 py-1 font-bold">{policy.category}</span>
              <span>📍 {policy.location}</span>
              <span>🔄 {policy.frequency}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Time Remaining</p>
            <p className="text-xl font-bold text-red-600">{policy.timeRemaining}</p>
          </div>
        </div>
      </div>

      {/* Coverage and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="nb-betting-panel-success p-4 text-center">
          <p className="font-bold text-sm">TOTAL COVERAGE</p>
          <p className="text-xl font-bold">{formatCoverage(policy.totalCoverage)}</p>
        </div>
        <div className="nb-betting-panel-accent p-4 text-center">
          <p className="font-bold text-sm">COVERAGE TYPE</p>
          <p className="text-xl font-bold">Parametric</p>
        </div>
        <div className="nb-betting-panel-warning p-4 text-center">
          <p className="font-bold text-sm">DATA SOURCE</p>
          <p className="text-sm font-bold">WeatherXM</p>
        </div>
      </div>

      {/* Policy Options */}
      <div className="nb-betting-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">Coverage Options</h2>
        <div className="space-y-3">
          {policy.options.map((option, index) => (
            <PolicyOption key={index} option={option} />
          ))}
        </div>
      </div>
    </div>
  );
}