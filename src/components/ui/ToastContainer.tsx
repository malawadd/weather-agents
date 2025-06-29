import React from 'react';
import { Toast } from './Toast';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastState[];
  onHideToast: (id: string) => void;
}

export function ToastContainer({ toasts, onHideToast }: ToastContainerProps) {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 1000 - index 
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onHideToast(toast.id)}
            isVisible={true}
          />
        </div>
      ))}
    </div>
  );
}