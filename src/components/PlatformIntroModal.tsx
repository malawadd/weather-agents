import React from 'react';
import { Link } from 'react-router-dom';

interface PlatformIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  platformLink: string;
  platformName: string;
  features: string[];
  theme?: 'default' | 'insurance';
}

export function PlatformIntroModal({
  isOpen,
  onClose,
  title,
  description,
  platformLink,
  platformName,
  features,
  theme = 'default'
}: PlatformIntroModalProps) {
  if (!isOpen) return null;

  // Theme-aware class selection
  const getThemeClasses = () => {
    if (theme === 'insurance') {
      return {
        modalContainer: 'nb-insurance-panel-white',
        closeButton: 'nb-insurance-button',
        enterButton: 'nb-insurance-button-accent',
        featurePanel: 'nb-insurance-panel',
        maybeButton: 'nb-insurance-button'
      };
    }
    return {
      modalContainer: 'nb-panel-white',
      closeButton: 'nb-button',
      enterButton: 'nb-button-accent',
      featurePanel: 'nb-panel',
      maybeButton: 'nb-button'
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.modalContainer} p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto`}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className={`${themeClasses.closeButton} px-4 py-2 font-bold`}
          >
            ✕
          </button>
        </div>

        <p className="text-lg mb-6 font-medium">{description}</p>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">🌟 Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className={`${themeClasses.featurePanel} p-3`}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">✨</span>
                  <span className="font-medium">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to={platformLink}
            className={`flex-1 ${themeClasses.enterButton} py-4 text-xl font-bold text-center`}
          >
            🚀 Enter {platformName}
          </Link>
          <button
            onClick={onClose}
            className={`${themeClasses.maybeButton} px-6 py-4 font-bold`}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}