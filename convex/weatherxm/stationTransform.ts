import { getRegionFromCoordinates, getCountryFromCoordinates } from './regionUtils';

export interface TransformedStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    address: string;
    elevation?: number;
    cellId?: string;
  };
  isActive: boolean;
  lastActivity?: string;
  lastDayQod?: number;
  createdAt?: string;
  region: string;
  country: string;
}

export function transformStation(station: any): TransformedStation {
  const lat = station.lat || 0;
  const lon = station.lon || 0;
  const region = getRegionFromCoordinates(lat, lon);
  const country = getCountryFromCoordinates(lat, lon);
  
  return {
    id: station.id,
    name: station.name || `Station ${station.id}`,
    location: {
      lat,
      lon,
      address: `${country !== 'Unknown' ? country + ', ' : ''}${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      elevation: station.elevation,
      cellId: station.cellId,
    },
    isActive: (station.lastDayQod || 0) > 0.5,
    lastActivity: station.createdAt,
    lastDayQod: station.lastDayQod,
    createdAt: station.createdAt,
    region: region,
    country: country,
  };
}

export function transformStations(stations: any[]): TransformedStation[] {
  return stations.map(transformStation);
}