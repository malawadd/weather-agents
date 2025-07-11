import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../WalletAuthProvider';

export function PlatformSelectionPage() {
  const { user, isGuest, signOut } = useAuth();

  const platforms = [
    {
      id: 'weather-intelligence',
      title: 'Weather Intelligence Platform',
      description: 'Explore global weather stations and get AI-powered insights about weather patterns and conditions.',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      path: '/weather-intelligence',
      available: true,
      hoverColor: '#a589e8',
      buttonClass: 'nb-button-accent',
    },
    {
      id: 'weather-betting',
      title: 'Weather Betting Platform',
      description: 'Place bets on weather predictions and compete with other weather enthusiasts.',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      path: '/weather-betting',
      available: true,
      hoverColor: '#66ccff',
      buttonClass: 'nb-betting-button-accent',
    },
    {
      id: 'future-innovations',
      title: 'Weather Insurance Platform',
      description: 'Weatherxm X eulerfinance.',
      image: 'https://images.pexels.com/photos/2496572/pexels-photo-2496572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      path: '/future-platform',
      available: false,
      hoverColor: 'var(--nb-warning)',
      buttonClass: 'nb-button',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Overlay Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
      <div className="absolute top-8 left-1/2 z-30"
     style={{ transform: 'translateX(-50%)' }}>
  <div
    className="bg-[#ffb3ba] border-4 border-black px-8 py-3  shadow-[4px_4px_0_#111]
                text-black text-xl md:text-2xl font-extrabold uppercase tracking-wide"
    
  >
    Choose Your Kiyan
  </div>
  
</div>
        
        {/* User info in top right */}
        <div className="absolute top-8 right-8 pointer-events-auto z-40">
  <div
    className="flex items-center space-x-4
               bg-white
               border-4 border-black
               
               px-5 py-3
               shadow-[4px_4px_0_#111]
               font-bold"
    style={{ fontFamily: "Montserrat, Arial Black, sans-serif" }}
  >
    <span className="text-black text-sm font-extrabold">
      Welcome, {user?.name || 'Explorer'}!
      {isGuest && <span className="text-gray-500 font-normal"> (Guest)</span>}
    </span>
    <button
      onClick={signOut}
      className="bg-[#ffe066] border-2 border-black text-black px-4 py-1.5 rounded-xl font-bold text-sm shadow-[2px_2px_0_#111] hover:bg-[#ffd23f] active:translate-y-1 active:shadow-none transition-all"
      style={{ fontFamily: "Montserrat, Arial Black, sans-serif" }}
    >
      Sign Out
    </button>
  </div>
</div>
      </div>

      {/* Platform Selection Grid - Full Screen */}
      
      <div className="flex-1 flex">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex-1 h-screen relative group">
            {platform.available ? (
              <Link
                to={platform.path}
                className="block w-full h-full relative overflow-hidden"
              >
                <img
                  src={platform.image}
                  alt={platform.title}
                  className="absolute inset-0 w-full h-full object-cover platform-choice-image transition-all duration-500 group-hover:scale-110"
                />
                
                {/* Neobrutalism hover overlay with color */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to top, ${platform.hoverColor}, ${platform.hoverColor}70, transparent)`
                  }}
                />

                
                {/* Neobrutalism border on hover */}
                <div className="absolute inset-4 border-8 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Platform info - appears on hover with neobrutalism styling */}
                <div className="absolute bottom-8 left-8 right-8 text-black opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-3xl font-bold mb-4 text-shadow-lg">{platform.title}</h3>
                  <p className="text-lg mb-6 text-shadow-md font-bold">{platform.description}</p>
                  <div className={`${platform.buttonClass} px-6 py-3 font-bold text-lg inline-block`}>
                    Enter Platform →
                  </div>
                </div>
              </Link>
            ) : (
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={platform.image}
                  alt={platform.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale"
                />
                
                {/* Coming soon overlay */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  {/* Neobrutalism Coming Soon badge */}
                  <div className="nb-panel-warning px-6 py-3 font-bold text-xl mb-6 transform -rotate-12">
                    🚧 Coming Soon
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white text-shadow-lg text-center">{platform.title}</h3>
                  <p className="text-lg text-gray-300 text-shadow-md text-center max-w-md px-4">{platform.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}