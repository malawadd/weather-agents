import React from 'react';
import { BidDetail } from '../../data/mockBettingData';
import { BidOption } from './BidOption';

interface BidDetailsSectionProps {
  bid: BidDetail;
}

export function BidDetailsSection({ bid }: BidDetailsSectionProps) {
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(3)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="nb-betting-panel-white p-6">
        <div className="flex items-start space-x-6">
          <img 
            src={bid.image} 
            alt={bid.question}
            className="w-24 h-24 object-cover rounded border-4 border-black"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{bid.question}</h1>
            <p className="text-gray-600 mb-2">{bid.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="nb-betting-panel-accent px-2 py-1 font-bold">{bid.category}</span>
              <span>📍 {bid.location}</span>
              <span>🔄 {bid.frequency}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Time Remaining</p>
            <p className="text-xl font-bold text-red-600">{bid.timeRemaining}</p>
          </div>
        </div>
      </div>

      {/* Volume and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="nb-betting-panel-success p-4 text-center">
          <p className="font-bold text-sm">TOTAL VOLUME</p>
          <p className="text-xl font-bold">{formatVolume(bid.totalVolume)}</p>
        </div>
        <div className="nb-betting-panel-accent p-4 text-center">
          <p className="font-bold text-sm">CHANCE</p>
          <p className="text-xl font-bold">Varied</p>
        </div>
        <div className="nb-betting-panel-warning p-4 text-center">
          <p className="font-bold text-sm">DATA SOURCE</p>
          <p className="text-sm font-bold">WeatherXM</p>
        </div>
      </div>

      {/* Betting Options */}
      <div className="nb-betting-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">Betting Options</h2>
        <div className="space-y-3">
          {bid.options.map((option, index) => (
            <BidOption key={index} option={option} />
          ))}
        </div>
      </div>
    </div>
  );
}