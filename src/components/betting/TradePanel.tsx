import React, { useState } from 'react';

interface TradePanelProps {
  bidId: string;
  selectedOption?: string;
}

export function TradePanel({ bidId, selectedOption }: TradePanelProps) {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [position, setPosition] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('Dollars');

  const handleTrade = () => {
    // TODO: Implement smart contract interaction
    console.log('Trade:', { bidId, tradeType, position, amount, currency });
    alert('Trading functionality will be implemented with smart contract integration!');
  };

  return (
    <div className="nb-betting-panel-white p-6 sticky top-6">
      <h3 className="text-xl font-bold mb-4">
        {selectedOption || 'Select an option to trade'}
      </h3>
      
      {selectedOption && (
        <>
          {/* Buy/Sell Toggle */}
          <div className="flex mb-4">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-2 px-4 font-bold ${
                tradeType === 'buy' 
                  ? 'nb-betting-button-success' 
                  : 'nb-betting-button'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-2 px-4 font-bold ${
                tradeType === 'sell' 
                  ? 'nb-betting-button-success' 
                  : 'nb-betting-button'
              }`}
            >
              Sell
            </button>
          </div>

          {/* Currency Selection */}
          <div className="mb-4">
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="nb-betting-input w-full px-3 py-2"
            >
              <option value="Dollars">Dollars</option>
              <option value="Shares">Shares</option>
            </select>
          </div>

          {/* Yes/No Position */}
          <div className="flex mb-4">
            <button
              onClick={() => setPosition('yes')}
              className={`flex-1 py-3 px-4 font-bold text-lg ${
                position === 'yes' 
                  ? 'nb-betting-button-success' 
                  : 'nb-betting-button'
              }`}
            >
              Yes 39¢
            </button>
            <button
              onClick={() => setPosition('no')}
              className={`flex-1 py-3 px-4 font-bold text-lg ${
                position === 'no' 
                  ? 'nb-betting-button-success' 
                  : 'nb-betting-button'
              }`}
            >
              No 63¢
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block font-bold mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$0"
              className="nb-betting-input w-full px-4 py-3 text-2xl text-center"
            />
          </div>

          {/* Trade Button */}
          <button
            onClick={handleTrade}
            disabled={!amount}
            className="nb-betting-button-success w-full py-4 font-bold text-lg disabled:opacity-50"
          >
            {amount ? `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${position.toUpperCase()}` : 'Sign up to trade'}
          </button>

          {/* Trade Summary */}
          {amount && (
            <div className="mt-4 nb-betting-panel p-3">
              <div className="flex justify-between text-sm">
                <span>Avg price</span>
                <span>{position === 'yes' ? '39¢' : '63¢'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shares</span>
                <span>{Math.floor(parseFloat(amount || '0') / (position === 'yes' ? 0.39 : 0.63))}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>${amount}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}