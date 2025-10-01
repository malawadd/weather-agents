import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../WalletAuthProvider';
import { NewsSlider } from '../components/NewsSlider';
import { PlatformIntroModal } from '../components/PlatformIntroModal';

export function PlatformSelectionPage() {
  const location = useLocation();
  
  // Only use auth if we're in an authenticated context
  let user = null;
  let isGuest = true;
  let signOut = () => {};
  
  try {
    const auth = useAuth();
    user = auth.user;
    isGuest = auth.isGuest;
    signOut = auth.signOut;
  } catch (error) {
    // Auth context not available, use defaults
  }
  
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    platformLink: string;
    platformName: string;
    features: string[];
  }>({
    isOpen: false,
    title: '',
    description: '',
    platformLink: '',
    platformName: '',
    features: []
  });

  const openWeatherIntelligenceModal = () => {
    setModalData({
      isOpen: true,
      title: '🌤️ Weather Intelligence Platform',
      description: 'Explore global weather stations, save your favorites, and get AI-powered insights about weather patterns and conditions.',
      platformLink: '/weather-intelligence',
      platformName: 'Weather Intelligence',
      features: [
        'Global weather station explorer',
        'AI-powered weather insights',
        'Real-time weather data',
        'Historical weather analysis',
        'Personalized station management',
        'Interactive weather chat'
      ]
    });
  };

  const openWeatherBettingModal = () => {
    setModalData({
      isOpen: true,
      title: '🎲 Weather Betting Platform',
      description: 'Place bets on weather predictions and compete with other weather enthusiasts worldwide.',
      platformLink: '/weather-betting',
      platformName: 'Weather Betting',
      features: [
        'Temperature prediction markets',
        'Real-time betting odds',
        'Prize pool competitions',
        'Smart contract security',
        'Community leaderboards',
        'Weather-based gaming'
      ]
    });
  };

  const closeModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2)',
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Top Navigation Bar */}
      <div className="relative z-30 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="nb-panel-white px-6 py-3">
            <h1 className="text-xl md:text-2xl font-bold">🤖 KIYAN ECOSYSTEM</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="nb-panel px-3 py-2">
              <span className="text-white font-bold text-xs md:text-sm">STORE</span>
            </div>
            <div className="nb-panel px-3 py-2">
              <span className="text-white font-bold text-xs md:text-sm">REWARDS</span>
            </div>
            <div className="nb-panel px-3 py-2">
              <span className="text-white font-bold text-xs md:text-sm">QUESTS</span>
            </div>
            <div className="nb-panel px-3 py-2">
              <span className="text-white font-bold text-xs md:text-sm">WORLD</span>
            </div>
            <div className="nb-panel-accent px-3 py-2">
              <span className="font-bold text-xs md:text-sm">PORTAL</span>
            </div>
            <div className="nb-panel-white px-4 py-2 flex items-center space-x-2">
              {user ? (
                <>
                  <span className="font-bold text-xs md:text-sm">{user?.name || 'Explorer'}</span>
                  {isGuest && <span className="text-xs text-gray-600">(Guest)</span>}
                  <button onClick={signOut} className="text-xs font-bold text-red-600">✕</button>
                </>
              ) : (
                <span className="font-bold text-xs md:text-sm">Welcome, Visitor!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Central Content */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="text-center text-white max-w-4xl">
          <div className="mb-8">
            <p className="text-sm md:text-lg font-bold text-gray-300 mb-2">Latest Platform</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-md">Weather Intelligence</h1>
            <h2 className="text-xl md:text-3xl font-bold mb-6 text-shadow-sm">AI-POWERED INSIGHTS</h2>
            <p className="text-base md:text-xl text-shadow-sm max-w-2xl mx-auto">
              Harness the power of global weather data with AI-driven analysis and real-time insights from the WeatherXM network.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section - Platform Cards and News */}
      <div className="relative z-30 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          {/* Platform Cards */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full md:w-auto">
            <button 
              onClick={openWeatherIntelligenceModal}
              className="nb-panel-white p-4 md:p-6 hover:nb-panel-accent transition-all duration-200 group w-full sm:w-auto"
            >
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 nb-panel flex items-center justify-center">
                  <span className="text-xl md:text-2xl">🌤️</span>
                </div>
                <p className="font-bold text-sm md:text-base">Weather Intelligence</p>
              </div>
            </button>

            <button 
              onClick={openWeatherBettingModal}
              className="nb-panel-white p-4 md:p-6 hover:nb-panel-accent transition-all duration-200 group w-full sm:w-auto"
            >
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 nb-panel flex items-center justify-center">
                  <span className="text-xl md:text-2xl">🎲</span>
                </div>
                <p className="font-bold text-sm md:text-base">Weather Betting</p>
              </div>
            </button>
          </div>

          {/* News Slider */}
          <div className="w-full md:w-auto">
            <NewsSlider />
          </div>
        </div>
      </div>

      {/* Platform Introduction Modal */}
      <PlatformIntroModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        description={modalData.description}
        platformLink={modalData.platformLink}
        platformName={modalData.platformName}
        features={modalData.features}
      />
    </div>
  );
}