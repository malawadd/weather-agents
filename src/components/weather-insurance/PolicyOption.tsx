import React from 'react';
import { PolicyOption as PolicyOptionType } from '../../data/mockInsuranceData';

interface PolicyOptionProps {
  option: PolicyOptionType;
}

export function PolicyOption({ option }: PolicyOptionProps) {
  const getTrendIcon = (trend?: number) => {
    if (!trend) return '';
    return trend > 0 ? '📈' : '📉';
  };

  const getTrendColor = (trend?: number) => {
    if (!trend) return '';
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="nb-betting-panel p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-lg">{option.range}</span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">{option.percentage}% coverage</span>
            {option.trend && (
              <span className={`text-sm font-bold ${getTrendColor(option.trend)}`}>
                {getTrendIcon(option.trend)} {Math.abs(option.trend)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <div className="nb-betting-button-success px-6 py-2 font-bold text-center">
            {option.premiumRate}% premium
          </div>
          <div className="nb-betting-button px-6 py-2 font-bold text-center">
            {option.coverageRatio}% payout
          </div>
        </div>
      </div>
    </div>
  );
}