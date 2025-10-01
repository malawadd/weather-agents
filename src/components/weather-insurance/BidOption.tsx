import React from 'react';
import { BidOption as BidOptionType } from '../../data/mockBettingData';

interface BidOptionProps {
  option: BidOptionType;
}

export function BidOption({ option }: BidOptionProps) {
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
            <span className="text-2xl font-bold">{option.percentage}%</span>
            {option.trend && (
              <span className={`text-sm font-bold ${getTrendColor(option.trend)}`}>
                {getTrendIcon(option.trend)} {Math.abs(option.trend)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button className="nb-betting-button-success px-6 py-2 font-bold">
            Yes {option.yesPrice}¢
          </button>
          <button className="nb-betting-button px-6 py-2 font-bold">
            No {option.noPrice}¢
          </button>
        </div>
      </div>
    </div>
  );
}