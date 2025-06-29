import { useState, useEffect } from 'react';
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
  };
  isActive: boolean;
  lastActivity?: string;
}

interface UseWeatherStationsProps {
  sessionId: Id<"sessions"> | null;
  searchTerm?: string;
  currentPage?: number;
}

export function useWeatherStations({ sessionId, searchTerm = '', currentPage = 1 }: UseWeatherStationsProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingStations, setAddingStations] = useState<Set<string>>(new Set());

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
      });
      
      const transformedStations = result.data?.map((station: any) => ({
        id: station.id,
        name: station.name || `Station ${station.id}`,
        location: {
          lat: station.location?.lat || 0,
          lon: station.location?.lon || 0,
          address: station.location?.address || 'Unknown Location',
        },
        isActive: station.isActive || false,
        lastActivity: station.lastActivity,
      })) || [];

      setStations(transformedStations);
    } catch (err: any) {
      setError(err.message || 'Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async (station: Station) => {
    if (!sessionId) return;

    setAddingStations(prev => new Set(prev).add(station.id));
    try {
      await addStationToMyStations({
        sessionId,
        stationId: station.id,
        stationData: {
          name: station.name,
          location: station.location,
          address: station.location.address,
          isActive: station.isActive,
        },
      });
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
    loadStations,
    handleAddStation,
    setError,
  };
}