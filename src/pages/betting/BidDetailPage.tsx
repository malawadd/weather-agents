import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBidDetails } from '../../data/mockBettingData';
import { BidDetailsSection } from '../../components/betting/BidDetailsSection';
import { TradePanel } from '../../components/betting/TradePanel';
import { BidRulesSection } from '../../components/betting/BidRulesSection';

export function BidDetailPage() {
  const { bidId } = useParams<{ bidId: string }>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const bid = bidId ? mockBidDetails[bidId] : null;

  if (!bid) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="nb-betting-panel-warning p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Bet Not Found</h2>
          <p className="mb-4">The betting market you're looking for doesn't exist or has ended.</p>
          <Link to="/weather-betting" className="nb-betting-button-accent px-6 py-3 font-bold">
            ← Back to Active Bets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link to="/weather-betting" className="hover:underline font-bold">Active Bets</Link>
        <span>→</span>
        <span className="text-gray-600">{bid.question}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <BidDetailsSection bid={bid} />
          <BidRulesSection bid={bid} />
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <TradePanel bidId={bid.id} selectedOption={selectedOption} />
        </div>
      </div>

      {/* Related Bets */}
      <div className="nb-betting-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">🔗 Related Weather Bets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(mockBidDetails)
            .filter(relatedBid => relatedBid.id !== bid.id && relatedBid.category === bid.category)
            .slice(0, 3)
            .map(relatedBid => (
              <Link 
                key={relatedBid.id} 
                to={`/weather-betting/bid/${relatedBid.id}`}
                className="nb-betting-panel p-4 hover:nb-betting-panel-accent transition-all"
              >
                <h3 className="font-bold text-sm mb-2">{relatedBid.question}</h3>
                <p className="text-xs text-gray-600">{relatedBid.location}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}