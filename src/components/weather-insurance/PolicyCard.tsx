import React from 'react';
import { Link } from 'react-router-dom';
import { Policy } from '../../data/mockInsuranceData';

interface PolicyCardProps {
  policy: Policy;
}

export function PolicyCard({ policy }: PolicyCardProps) {
  const formatCoverage = (coverage: number) => {
    if (coverage >= 1000000) {
      return `$${(coverage / 1000000).toFixed(1)}M`;
    }
    return `$${coverage.toLocaleString()}`;
  };

  const getTopOption = () => {
    if (!policy.options || policy.options.length === 0) {
      return {
        range: 'No data',
        percentage: 0,
        premiumRate: 0,
        coverageRatio: 0
      };
    }
    return policy.options.reduce((prev, current) => 
      prev.percentage > current.percentage ? prev : current
    );
  };

  const topOption = getTopOption();

  return (
    <Link to={`/weather-insurance/policy/${policy.id}`}>
      <div className="nb-insurance-panel-white p-4 hover:nb-insurance-panel-accent transition-all duration-200 cursor-pointer">
        {/* Image and Question */}
        <div className="flex items-start space-x-4 mb-4">
          <img 
            src={policy.image} 
            alt={policy.question}
            className="w-16 h-16 object-cover rounded border-2 border-black"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{policy.question}</h3>
            <p className="text-sm text-gray-600">{policy.location}</p>
          </div>
        </div>

        {/* Top Option Display */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{topOption.range}</span>
            <span className="text-lg font-bold">{topOption.percentage}% coverage</span>
          </div>
          <div className="flex space-x-2">
            <div className="nb-insurance-button-success px-3 py-1 text-sm font-bold flex-1 text-center">
              {topOption.premiumRate}% premium
            </div>
            <div className="nb-insurance-button px-3 py-1 text-sm font-bold flex-1 text-center">
              {topOption.coverageRatio}% payout
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>{formatCoverage(policy.totalCoverage)} coverage</span>
            <span className="flex items-center">
              🔄 {policy.frequency}
            </span>
          </div>
          <span className="font-bold text-red-600">{policy.timeRemaining}</span>
        </div>
      </div>
    </Link>
  );
}