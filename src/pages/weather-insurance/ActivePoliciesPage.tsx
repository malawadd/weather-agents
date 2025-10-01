import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PolicyCard } from '../../components/weather-insurance/PolicyCard';
import { mockActivePolicies } from '../../data/mockInsuranceData';

export function ActivePoliciesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('coverage');
  
  const categories = ['All', 'Drought', 'Rainfall', 'Temperature', 'Natural Disasters'];
  
  const filteredPolicies = mockActivePolicies.filter(policy => 
    selectedCategory === 'All' || policy.category === selectedCategory
  );

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    switch (sortBy) {
      case 'coverage':
        return b.totalCoverage - a.totalCoverage;
      case 'time':
        return a.timeRemaining.localeCompare(b.timeRemaining);
      case 'activity':
        return b.options.length - a.options.length;
      default:
        return 0;
    }
  });

  return (
    <div className="w-full px-4 space-y-6">
      {/* Header */}
      <div className="nb-insurance-panel-white p-6">
        <h1 className="text-3xl font-bold mb-2">☔ All Weather Insurance Policies</h1>
        <p className="text-gray-600">
          Browse all available weather insurance policies and find the perfect protection for your needs.
        </p>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 nb-insurance-panel-accent p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Category:</span>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="nb-insurance-input px-3 py-1 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="nb-insurance-input px-3 py-1 text-sm"
              >
                <option value="coverage">Coverage Amount</option>
                <option value="time">Time Remaining</option>
                <option value="activity">Activity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="nb-insurance-panel-success p-4">
          <div className="text-center">
            <p className="font-bold text-sm">TOTAL POLICIES</p>
            <p className="text-2xl font-bold">{filteredPolicies.length}</p>
          </div>
        </div>
      </div>

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="nb-insurance-panel p-8 text-center">
          <h3 className="text-xl font-bold mb-4">📭 No Policies Found</h3>
          <p className="text-gray-600 mb-6">
            {selectedCategory === 'All' 
              ? 'No insurance policies are currently available.'
              : `No ${selectedCategory.toLowerCase()} insurance policies found.`
            }
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setSelectedCategory('All')}
              className="nb-insurance-button-accent px-6 py-3 font-bold"
            >
              Show All Policies
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="nb-insurance-panel-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">💰 Total Coverage</h3>
          <p className="text-2xl font-bold text-green-600">
            ${mockActivePolicies.reduce((sum, policy) => sum + policy.totalCoverage, 0).toLocaleString()}
          </p>
        </div>
        <div className="nb-insurance-panel-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">📋 Active Policies</h3>
          <p className="text-2xl font-bold text-blue-600">{mockActivePolicies.length}</p>
        </div>
        <div className="nb-insurance-panel-white p-6 text-center">
          <h3 className="font-bold text-lg mb-2">🏆 Top Category</h3>
          <p className="text-2xl font-bold text-purple-600">Temperature</p>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link to="/weather-insurance" className="nb-insurance-button px-6 py-3 font-bold">
          ← Back to Insurance Home
        </Link>
      </div>
    </div>
  );
}