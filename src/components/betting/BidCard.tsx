import React from 'react';
import { Link } from 'react-router-dom';
import { Bid } from '../../data/mockBettingData';

interface BidCardProps {
  bid: Bid;
}

export function BidCard({ bid }: BidCardProps) {
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  const getTopOption = () => {
    return bid.options.reduce((prev, current) => 
      prev.percentage > current.percentage ? prev : current
    );
  };

  const topOption = getTopOption();

  return (
    <Link to={`/weather-betting/bid/${bid.id}`}>
      <div className="nb-betting-panel-white p-4 hover:nb-betting-panel-accent transition-all duration-200 cursor-pointer">
        {/* Image and Question */}
        <div className="flex items-start space-x-4 mb-4">
          <img 
            src={bid.image} 
            alt={bid.question}
            className="w-16 h-16 object-cover rounded border-2 border-black"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{bid.question}</h3>
            <p className="text-sm text-gray-600">{bid.location}</p>
          </div>
        </div>

        {/* Top Option Display */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{topOption.range}</span>
            <span className="text-lg font-bold">{topOption.percentage}%</span>
          </div>
          <div className="flex space-x-2">
            <button className="nb-betting-button-success px-3 py-1 text-sm font-bold flex-1">
              Yes {topOption.yesPrice}¢
            </button>
            <button className="nb-betting-button px-3 py-1 text-sm font-bold flex-1">
              No {topOption.noPrice}¢
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>{formatVolume(bid.totalVolume)} vol</span>
            <span className="flex items-center">
              🔄 {bid.frequency}
            </span>
          </div>
          <span className="font-bold text-red-600">{bid.timeRemaining}</span>
        </div>
      </div>
    </Link>
  );
}