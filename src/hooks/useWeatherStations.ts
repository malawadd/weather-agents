import { useState } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

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
  region?: string;
  country?: string;
}

interface UseWeatherStationsProps {
  sessionId: Id<"sessions"> | null;
  searchTerm?: string;
  currentPage?: number;
  selectedRegion?: string;
  onStationAdded?: (stationName: string) => void;
}

export function useWeatherStations({ 
  sessionId, 
  searchTerm = '', 
  currentPage = 1,
  selectedRegion = '',
  onStationAdded
}: UseWeatherStationsProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingStations, setAddingStations] = useState<Set<string>>(new Set());
  const [totalPages, setTotalPages] = useState(1);
  const [totalStations, setTotalStations] = useState(0);

  const fetchStations = useAction(api.weatherxmApi.fetchStations);
  const addStationToMyStations = useMutation(api.weatherxmApi.addStationToMyStations);
  const savedStations = useQuery(api.weatherxmApi.getMySavedStations, 
    sessionId ? { sessionId } : "skip"
  );

  const loadStations = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStations({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
        region: selectedRegion || undefined,
      });
      
      if (result && result.data) {
        setStations(result.data);
        setTotalPages(result.totalPages || 1);
        setTotalStations(result.total || 0);
      } else {
        setStations([]);
        setTotalPages(1);
        setTotalStations(0);
      }
    } catch (err: any) {
      console.error('Error loading stations:', err);
      setError(err.message || 'Failed to load stations');
      setStations([]);
      setTotalPages(1);
      setTotalStations(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async (station: Station) => {
    if (!sessionId) {
      setError('Please sign in to add stations');
      return;
    }

    setAddingStations(prev => new Set(prev).add(station.id));
    try {
      // Fixed: Only pass the required fields that match the schema
      await addStationToMyStations({
        sessionId,
        stationId: station.id,
        stationData: {
          name: station.name,
          location: {
            lat: station.location.lat,
            lon: station.location.lon,
            elevation: station.location.elevation,
            cellId: station.location.cellId,
          },
          address: station.location.address,
          isActive: station.isActive,
          lastDayQod: station.lastDayQod,
          createdAt: station.createdAt,
          region: station.region,
          country: station.country,
        },
      });
      
      // Call the success callback
      if (onStationAdded) {
        onStationAdded(station.name);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add station');
    } finally {
      setAddingStations(prev => {
        const newSet = new Set(prev);
        newSet.delete(station.id);
        return newSet;
      });
    }
  };

  return {
    stations,
    loading,
    error,
    addingStations,
    savedStations,
    totalPages,
    totalStations,
    loadStations,
    handleAddStation,
    setError,
  };
}