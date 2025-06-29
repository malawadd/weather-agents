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
      console.log('Loading stations with params:', { currentPage, searchTerm });
      
      const result = await fetchStations({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
      });
      
      console.log('Stations result:', result);
      
      if (result && result.data) {
        setStations(result.data);
      } else {
        console.warn('No data in stations result:', result);
        setStations([]);
      }
    } catch (err: any) {
      console.error('Error loading stations:', err);
      setError(err.message || 'Failed to load stations');
      setStations([]);
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
      console.log('Station added successfully:', station.id);
    } catch (err: any) {
      console.error('Error adding station:', err);
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