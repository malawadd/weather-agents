import React from 'react';
import { StationCard } from './StationCard';

interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    address?: string;
    elevation?: number;
    cellId?: string;
  };
  isActive: boolean;
  lastActivity?: string;
  lastDayQod?: number;
  createdAt?: string;
}

interface StationsGridProps {
  stations: Station[];
  addingStations: Set<string>;
  isGuest: boolean;
  onAddStation: (station: Station) => void;
}

export function StationsGrid({ stations, addingStations, isGuest, onAddStation }: StationsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stations.map((station) => (
        <StationCard
          key={station.id}
          station={station}
          onAddStation={onAddStation}
          isAdding={addingStations.has(station.id)}
          isGuest={isGuest}
        />
      ))}
    </div>
  );
}