import React, { useState } from 'react';
import { useAuth } from '../WalletAuthProvider';
import { NewsSlider } from '../components/NewsSlider';
import { PlatformIntroModal } from '../components/PlatformIntroModal';

export function PlatformSelectionPage() {
  const { user, isGuest, signOut } = useAuth();
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
      <div className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="flex justify-between items-center">
          <div className="nb-panel-white px-6 py-3">
            <h1 className="text-2xl font-bold">🤖 KIYAN ECOSYSTEM</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="nb-panel px-4 py-2">
              <span className="text-white font-bold text-sm">STORE</span>
            </div>
            <div className="nb-panel px-4 py-2">
              <span className="text-white font-bold text-sm">REWARDS</span>
            </div>
            <div className="nb-panel px-4 py-2">
              <span className="text-white font-bold text-sm">QUESTS</span>
            </div>
            <div className="nb-panel-accent px-4 py-2">
              <span className="font-bold text-sm">PORTAL</span>
            </div>
            <div className="nb-panel-white px-4 py-2 flex items-center space-x-2">
              <span className="font-bold text-sm">{user?.name || 'Explorer'}</span>
              {isGuest && <span className="text-xs text-gray-600">(Guest)</span>}
              <button onClick={signOut} className="text-xs font-bold text-red-600">✕</button>
            </div>
          </div>
        </div>
      </div>

      {/* Central Content */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center text-white max-w-4xl">
          <div className="mb-8">
            <p className="text-lg font-bold text-gray-300 mb-2">Latest Platform</p>
            <h1 className="text-6xl font-bold mb-4 text-shadow-md">Weather Intelligence</h1>
            <h2 className="text-3xl font-bold mb-6 text-shadow-sm">AI-POWERED INSIGHTS</h2>
            <p className="text-xl text-shadow-sm max-w-2xl mx-auto">
              Harness the power of global weather data with AI-driven analysis and real-time insights from the WeatherXM network.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Platform Cards */}
      <div className="absolute bottom-8 left-8 z-30">
        <div className="flex space-x-6">
          <button 
            onClick={openWeatherIntelligenceModal}
            className="nb-panel-white p-6 hover:nb-panel-accent transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 nb-panel flex items-center justify-center">
                <span className="text-2xl">🌤️</span>
              </div>
              <p className="font-bold">Weather Intelligence</p>
            </div>
          </button>

          <button 
            onClick={openWeatherBettingModal}
            className="nb-panel-white p-6 hover:nb-panel-accent transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 nb-panel flex items-center justify-center">
                <span className="text-2xl">🎲</span>
              </div>
              <p className="font-bold">Weather Betting</p>
            </div>
          </button>
        </div>
      </div>

      {/* News Slider - Bottom Right */}
      <div className="absolute bottom-8 right-8 z-30">
        <NewsSlider />
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