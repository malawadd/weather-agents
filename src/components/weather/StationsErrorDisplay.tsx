import React from 'react';

interface StationsErrorDisplayProps {
  error: string;
  onRetry: () => void;
  onDismiss: () => void;
}

export function StationsErrorDisplay({ error, onRetry, onDismiss }: StationsErrorDisplayProps) {
  return (
    <div className="nb-panel-warning p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-red-700 mb-1">⚠️ Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onRetry}
            className="nb-button px-3 py-1 text-sm font-bold"
          >
            Retry
          </button>
          <button 
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800 font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}