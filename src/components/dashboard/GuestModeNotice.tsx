import React from 'react';

interface GuestModeNoticeProps {
  onSignIn: () => void;
}

export function GuestModeNotice({ onSignIn }: GuestModeNoticeProps) {
  return (
    <div className="lg:col-span-3">
      <div className="nb-panel-warning p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">👤 Guest Mode Active</h3>
            <p className="font-medium">
              Sign in with your wallet to save weather stations and access personalized AI insights.
            </p>
          </div>
          <button 
            onClick={onSignIn}
            className="nb-button-accent px-6 py-3 text-lg"
          >
            🔗 Sign In
          </button>
        </div>
      </div>
    </div>
  );
}