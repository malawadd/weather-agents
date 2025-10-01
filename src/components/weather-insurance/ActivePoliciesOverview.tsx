import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PolicyCard } from './PolicyCard';
import { mockActivePolicies } from '../../data/mockInsuranceData';

export function ActivePoliciesOverview() {
  // Show first 3 policies for overview
  const featuredPolicies = mockActivePolicies.slice(0, 3);

  return (
    <div className="nb-insurance-panel-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Insurance Policies</h2>
        <Link to="/weather-insurance/policies" className="nb-insurance-button-accent px-6 py-3 font-bold">
          View All Policies
        </Link>
      </div>
      
      <p className="text-gray-600 mb-6">
        Protect your assets with our most popular weather insurance policies.
      </p>

      {/* Featured Policies Grid */}
      {featuredPolicies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      ) : (
        <div className="nb-insurance-panel p-8 text-center">
          <h3 className="text-xl font-bold mb-2">🏗️ No Policies Available</h3>
          <p className="text-gray-600 mb-4">
            No weather insurance policies are currently available.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t-4 border-black">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{mockActivePolicies.length}+</div>
          <p className="text-sm font-bold">Active Policies</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">24h</div>
          <p className="text-sm font-bold">Claim Processing</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">100%</div>
          <p className="text-sm font-bold">Automated</p>
        </div>
      </div>
    </div>
  );
}