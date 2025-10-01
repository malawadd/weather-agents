import React, { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
}

interface NewsSliderProps {
  newsItems?: NewsItem[];
}

const defaultNewsItems: NewsItem[] = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    title: 'WeatherXM Network Expansion',
    description: 'New weather stations deployed across Europe and North America',
    link: 'https://weatherxm.com/news/network-expansion'
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    title: 'AI Weather Insights Update',
    description: 'Enhanced AI models for better weather pattern analysis',
    link: 'https://kiyan.ai/news/ai-update'
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    title: 'Community Weather Betting',
    description: 'New prediction markets now live on the platform',
    link: 'https://kiyan.ai/news/betting-launch'
  }
];

export function NewsSlider({ newsItems = defaultNewsItems }: NewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [newsItems.length]);

  const currentNews = newsItems[currentIndex];

  return (
    <div className="w-full md:w-80 h-48 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${currentNews.image})` }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative h-full p-4 flex flex-col justify-between text-white">
        <div>
          <h3 className="font-bold text-lg mb-2 text-shadow-md">{currentNews.title}</h3>
          <p className="text-sm text-shadow-sm">{currentNews.description}</p>
        </div>
        
        <div className="flex justify-between items-end">
          <a
            href={currentNews.link}
            target="_blank"
            rel="noopener noreferrer"
            className="nb-button-accent px-4 py-2 text-sm font-bold"
          >
            Read More
          </a>
          
          <div className="flex space-x-1">
            {newsItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}