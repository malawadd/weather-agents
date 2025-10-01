import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockPolicyDetails } from '../../data/mockInsuranceData';

export function PolicyDetailPage() {
  const { policyId } = useParams<{ policyId: string }>();

  // Get policy detail from mock data
  const policyDetail = policyId ? mockPolicyDetails[policyId] : null;

  // Error state - policy not found
  if (!policyDetail) {
    return (
      <div className="w-full px-4 space-y-6">
        <div className="nb-insurance-panel-warning p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">❌ Policy Not Found</h2>
          <p className="mb-4">The insurance policy you're looking for doesn't exist.</p>
          <Link to="/weather-insurance" className="nb-insurance-button-accent px-6 py-3 font-bold">
            ← Back to Insurance Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link to="/weather-insurance/policies" className="hover:underline font-bold">Active Policies</Link>
        <span>→</span>
        <span className="text-gray-600">{policyDetail.question}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Policy Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="nb-insurance-panel-white p-6">
              <div className="flex items-start space-x-6">
                <img 
                  src={policyDetail.image} 
                  alt={policyDetail.question}
                  className="w-24 h-24 object-cover rounded border-4 border-black"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{policyDetail.question}</h1>
                  <p className="text-gray-600 mb-2">{policyDetail.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="nb-insurance-panel-accent px-2 py-1 font-bold">{policyDetail.category}</span>
                    <span>📍 {policyDetail.location}</span>
                    <span>🔄 {policyDetail.frequency}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Time Remaining</p>
                  <p className="text-xl font-bold text-red-600">{policyDetail.timeRemaining}</p>
                </div>
              </div>
            </div>

            {/* Coverage and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="nb-insurance-panel-success p-4 text-center">
                <p className="font-bold text-sm">TOTAL COVERAGE</p>
                <p className="text-xl font-bold">
                  ${policyDetail.totalCoverage >= 1000000 
                    ? `${(policyDetail.totalCoverage / 1000000).toFixed(1)}M` 
                    : policyDetail.totalCoverage.toLocaleString()
                  }
                </p>
              </div>
              <div className="nb-insurance-panel-accent p-4 text-center">
                <p className="font-bold text-sm">COVERAGE TYPE</p>
                <p className="text-xl font-bold">Parametric</p>
              </div>
              <div className="nb-insurance-panel-warning p-4 text-center">
                <p className="font-bold text-sm">DATA SOURCE</p>
                <p className="text-sm font-bold">WeatherXM</p>
              </div>
            </div>

            {/* Policy Options */}
            <div className="nb-insurance-panel-white p-6">
              <h2 className="text-xl font-bold mb-4">Coverage Options</h2>
              <div className="space-y-3">
                {policyDetail.options.map((option, index) => (
                  <div key={index} className="nb-insurance-panel p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-lg">{option.range}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{option.percentage}% coverage</span>
                          {option.trend && (
                            <span className={`text-sm font-bold ${
                              option.trend > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {option.trend > 0 ? '📈' : '📉'} {Math.abs(option.trend)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <div className="nb-insurance-button-success px-6 py-2 font-bold text-center">
                          {option.premiumRate}% premium
                        </div>
                        <div className="nb-insurance-button px-6 py-2 font-bold text-center">
                          {option.coverageRatio}% payout
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="nb-insurance-panel-white p-6">
            <h2 className="text-xl font-bold mb-4">📋 Policy Terms Summary</h2>
            
            <div className="space-y-4">
              <div className="nb-insurance-panel-accent p-4">
                <h3 className="font-bold mb-2">Payout Criteria</h3>
                <p className="text-sm">{policyDetail.termsSummary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="nb-insurance-panel p-3">
                  <h4 className="font-bold text-sm mb-1">Data Source</h4>
                  <p className="text-sm">{policyDetail.dataSource}</p>
                </div>
                <div className="nb-insurance-panel p-3">
                  <h4 className="font-bold text-sm mb-1">Verification</h4>
                  <p className="text-sm">{policyDetail.verificationMethod}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="nb-insurance-button-accent px-4 py-2 font-bold text-sm">
                  📖 View Full Terms
                </button>
                <button className="nb-insurance-button px-4 py-2 font-bold text-sm">
                  ❓ Help Center
                </button>
              </div>

              <div className="nb-insurance-panel-warning p-3">
                <p className="text-xs font-bold">
                  ⚠️ Important: Weather insurance payouts are based on parametric triggers. While checking multiple weather sources 
                  may help guide your decision, the official and final value used to determine policy payouts is the data 
                  reported by the {policyDetail.dataSource}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Panel */}
        <div className="lg:col-span-1">
          <div className="nb-insurance-panel-white p-6">
            <h3 className="text-xl font-bold mb-4">🛡️ Purchase Policy</h3>
            <div className="nb-insurance-panel-warning p-4 text-center">
              <p className="font-bold text-sm">🚧 Coming Soon</p>
              <p className="text-xs mt-1">Policy purchasing will be available when smart contracts are deployed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="text-center">
        <Link to="/weather-insurance/policies" className="nb-insurance-button px-6 py-3 font-bold">
          ← Back to All Policies
        </Link>
      </div>
    </div>
  );
}