import React from 'react';
import '../weather-ai/index.css';
import WeatherTwinApp from '../weather-ai/App';

export const WeatherPage: React.FC = () => {
  return (
    <div className="weather-ai-root rounded-2xl md:rounded-[24px] overflow-hidden border border-[#E3DDD2] shadow-soft bg-[#F7F4ED] animate-in fade-in duration-300">
      <WeatherTwinApp />
    </div>
  );
};
