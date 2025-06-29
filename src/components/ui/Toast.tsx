import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

export function Toast({ 
  message, 
  type = 'success', 
  duration = 4000, 
  onClose, 
  isVisible 
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'nb-panel-success border-green-500';
      case 'error':
        return 'nb-panel-warning border-red-500';
      case 'warning':
        return 'nb-panel-warning border-yellow-500';
      case 'info':
        return 'nb-panel border-blue-500';
      default:
        return 'nb-panel-success border-green-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 min-w-80 max-w-md ${getToastStyles()} 
        transform transition-all duration-300 ease-in-out ${
          isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getIcon()}</span>
          <div>
            <p className="font-bold text-sm">
              {type === 'success' && 'Success!'}
              {type === 'error' && 'Error!'}
              {type === 'warning' && 'Warning!'}
              {type === 'info' && 'Info'}
            </p>
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsAnimating(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-600 hover:text-black font-bold text-lg ml-4"
        >
          ✕
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all ease-linear ${
            type === 'success' ? 'bg-green-600' :
            type === 'error' ? 'bg-red-600' :
            type === 'warning' ? 'bg-yellow-600' :
            'bg-blue-600'
          }`}
          style={{
            width: isAnimating ? '0%' : '100%',
            transition: `width ${duration}ms linear`
          }}
        />
      </div>
    </div>
  );
}