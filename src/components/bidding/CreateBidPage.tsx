import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useBiddingContract } from '../../hooks/useBiddingContract';

export function CreateBidPage() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { createDraw, fundPot } = useBiddingContract();
  
  const [cityName, setCityName] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [thresholds, setThresholds] = useState<string[]>(['']);
  const [initialFunding, setInitialFunding] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addThreshold = () => {
    setThresholds([...thresholds, '']);
  };

  const removeThreshold = (index: number) => {
    if (thresholds.length > 1) {
      setThresholds(thresholds.filter((_, i) => i !== index));
    }
  };

  const updateThreshold = (index: number, value: string) => {
    const newThresholds = [...thresholds];
    newThresholds[index] = value;
    setThresholds(newThresholds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setError('Please connect your wallet');
      return;
    }

    // Validation
    if (!cityName.trim()) {
      setError('City name is required');
      return;
    }

    if (!endDate || !endTime) {
      setError('End date and time are required');
      return;
    }

    const endDateTime = new Date(`${endDate}T${endTime}`);
    if (endDateTime <= new Date()) {
      setError('End time must be in the future');
      return;
    }

    const validThresholds = thresholds
      .filter(t => t.trim() !== '')
      .map(t => parseFloat(t));

    if (validThresholds.length === 0) {
      setError('At least one temperature threshold is required');
      return;
    }

    if (validThresholds.some(t => isNaN(t))) {
      setError('All thresholds must be valid numbers');
      return;
    }

    // Convert to milli-degrees Celsius (contract expects int256 in milli-°C)
    const thresholdValues = validThresholds.map(t => Math.round(t * 1000));

    setSubmitting(true);
    setError(null);

    try {
      // Create the draw
      const endTimestamp = Math.floor(endDateTime.getTime() / 1000);
      await createDraw(cityName.trim(), endTimestamp, thresholdValues);

      // If initial funding is provided, fund the pot
      if (initialFunding && parseFloat(initialFunding) > 0) {
        // Note: In a real implementation, you'd get the drawId from the transaction receipt
        // For now, we'll skip the funding step or implement it separately
        console.log('Initial funding will be added separately');
      }

      navigate('/active-bids');
    } catch (err: any) {
      setError(err.message || 'Failed to create draw');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen nb-grid-bg">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="nb-panel-white p-6">
          <h1 className="text-3xl font-bold mb-2">🎯 Create Temperature Prediction Draw</h1>
          <p className="text-gray-600">
            Set up a new temperature prediction market for users to bet on weather outcomes
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="nb-panel p-6">
            <h3 className="text-xl font-bold mb-4">📍 Location & Timing</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">City Name</label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="e.g., New York, London, Tokyo"
                  className="nb-input w-full px-4 py-3"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the city name for temperature prediction
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="nb-input w-full px-4 py-3"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="nb-input w-full px-4 py-3"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Temperature Thresholds */}
          <div className="nb-panel p-6">
            <h3 className="text-xl font-bold mb-4">🌡️ Temperature Thresholds</h3>
            <p className="text-sm text-gray-600 mb-4">
              Set temperature thresholds that users can bet on. Users will predict if the actual temperature will be ABOVE these thresholds.
            </p>
            
            <div className="space-y-3">
              {thresholds.map((threshold, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={threshold}
                      onChange={(e) => updateThreshold(index, e.target.value)}
                      placeholder="e.g., 20.5"
                      className="nb-input w-full px-4 py-3"
                      step="0.1"
                    />
                  </div>
                  <span className="font-bold">°C</span>
                  {thresholds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeThreshold(index)}
                      className="nb-button-warning px-3 py-3 font-bold"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addThreshold}
              className="mt-4 nb-button px-4 py-2 font-bold"
            >
              ➕ Add Threshold
            </button>

            <div className="mt-4 nb-panel-accent p-4">
              <p className="text-sm font-bold">💡 Example:</p>
              <p className="text-sm">
                If you set thresholds at 15°C, 20°C, and 25°C, users can bet on:
                <br />• Temperature will be above 15°C
                <br />• Temperature will be above 20°C  
                <br />• Temperature will be above 25°C
              </p>
            </div>
          </div>

          {/* Optional Initial Funding */}
          <div className="nb-panel p-6">
            <h3 className="text-xl font-bold mb-4">💰 Initial Prize Pool (Optional)</h3>
            <div>
              <label className="block text-sm font-bold mb-2">Initial Funding Amount (USDC)</label>
              <input
                type="number"
                value={initialFunding}
                onChange={(e) => setInitialFunding(e.target.value)}
                placeholder="e.g., 1000"
                className="nb-input w-full px-4 py-3"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Add initial funding to the prize pool to attract more participants
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="nb-panel-warning p-4">
              <p className="font-bold text-red-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Link to="/active-bids" className="nb-button px-6 py-3 font-bold">
              ← Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !address}
              className="flex-1 nb-button-accent py-3 text-xl font-bold"
            >
              {submitting ? '⏳ Creating Draw...' : '🎯 Create Temperature Draw'}
            </button>
          </div>

          {!address && (
            <div className="nb-panel-warning p-4 text-center">
              <p className="font-bold">Connect your wallet to create a draw</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}