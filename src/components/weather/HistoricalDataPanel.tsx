import React, { useState } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { DatePicker } from './DatePicker';

interface HistoryDay {
  _id: string;
  date: string;
  observations: Array<{
    timestamp: string;
    temperature?: number;
    humidity?: number;
    wind_speed?: number;
    pressure?: number;
    precipitation_rate?: number;
    solar_irradiance?: number;
    uv_index?: number;
  }>;
  health: {
    data_quality: { score: number };
    location_quality: { score: number; reason?: string };
  };
}

interface HistoricalDataPanelProps {
  stationId: string;
  onSyncData: () => void;
  isSyncing: boolean;
}

export function HistoricalDataPanel({ stationId, onSyncData, isSyncing }: HistoricalDataPanelProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  });
  const [isLoadingSpecificDate, setIsLoadingSpecificDate] = useState(false);

  const fetchHistoryData = useAction(api.weatherxm.stationDataApi.fetchAndStoreHistoryData);
  
  const availableDates = useQuery(api.weatherxm.stationDataApi.getAvailableDates, 
    stationId ? { stationId } : "skip"
  );
  
  const specificDateData = useQuery(api.weatherxm.stationDataApi.getHistoryData,
    stationId && selectedDate ? { stationId, date: selectedDate } : "skip"
  );

  const recentHistoryData = useQuery(api.weatherxm.stationDataApi.getHistoryData,
    stationId ? { stationId, limit: 7 } : "skip"
  );

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleFetchSpecificDate = async () => {
    if (!stationId || !selectedDate) return;
    
    setIsLoadingSpecificDate(true);
    try {
      await fetchHistoryData({ stationId, date: selectedDate });
    } catch (error) {
      console.error('Failed to fetch data for selected date:', error);
    } finally {
      setIsLoadingSpecificDate(false);
    }
  };

  const calculateAverage = (observations: any[], field: string) => {
    const values = observations.map(obs => obs[field] || 0).filter(val => val > 0);
    return values.length > 0 ? (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1) : '0.0';
  };

  const calculateMinMax = (observations: any[], field: string) => {
    const values = observations.map(obs => obs[field] || 0).filter(val => val > 0);
    if (values.length === 0) return { min: '0.0', max: '0.0' };
    return {
      min: Math.min(...values).toFixed(1),
      max: Math.max(...values).toFixed(1)
    };
  };

  return (
    <div className="space-y-6">
      {/* Date Selection Panel */}
      <div className="nb-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">📅 Historical Data Viewer</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              availableDates={availableDates}
              disabled={isLoadingSpecificDate}
            />
            <button
              onClick={handleFetchSpecificDate}
              disabled={isLoadingSpecificDate || !selectedDate}
              className="w-full mt-4 nb-button-accent py-2 font-bold"
            >
              {isLoadingSpecificDate ? '🔄 Loading...' : '📊 Load Data for Selected Date'}
            </button>
          </div>
          
          {/* Selected Date Data */}
          <div className="lg:col-span-2">
            {specificDateData ? (
              <div className="nb-panel-success p-4">
                <h3 className="font-bold mb-3">📊 Data for {selectedDate}</h3>
                {specificDateData.observations && specificDateData.observations.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="nb-panel-white p-3">
                        <p className="font-bold">🌡️ Temperature</p>
                        <p>Avg: {calculateAverage(specificDateData.observations, 'temperature')}°C</p>
                        <p className="text-xs">
                          {calculateMinMax(specificDateData.observations, 'temperature').min}° - {calculateMinMax(specificDateData.observations, 'temperature').max}°
                        </p>
                      </div>
                      <div className="nb-panel-white p-3">
                        <p className="font-bold">💧 Humidity</p>
                        <p>Avg: {calculateAverage(specificDateData.observations, 'humidity')}%</p>
                        <p className="text-xs">
                          {calculateMinMax(specificDateData.observations, 'humidity').min}% - {calculateMinMax(specificDateData.observations, 'humidity').max}%
                        </p>
                      </div>
                      <div className="nb-panel-white p-3">
                        <p className="font-bold">💨 Wind</p>
                        <p>Avg: {calculateAverage(specificDateData.observations, 'wind_speed')} m/s</p>
                        <p className="text-xs">
                          {calculateMinMax(specificDateData.observations, 'wind_speed').min} - {calculateMinMax(specificDateData.observations, 'wind_speed').max} m/s
                        </p>
                      </div>
                      <div className="nb-panel-white p-3">
                        <p className="font-bold">🌊 Pressure</p>
                        <p>Avg: {calculateAverage(specificDateData.observations, 'pressure')} hPa</p>
                        <p className="text-xs">
                          {calculateMinMax(specificDateData.observations, 'pressure').min} - {calculateMinMax(specificDateData.observations, 'pressure').max} hPa
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {specificDateData.observations.length} observations recorded on this date
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No observations available for this date</p>
                )}
              </div>
            ) : (
              <div className="nb-panel p-4 text-center">
                <p className="text-gray-500 mb-2">Select a date to view historical data</p>
                <p className="text-xs text-gray-400">
                  Data is available for the last 30 days
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent History Overview */}
      <div className="nb-panel-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📈 Recent History Overview</h2>
          <button
            onClick={onSyncData}
            disabled={isSyncing}
            className="nb-button-success px-4 py-2 font-bold"
          >
            {isSyncing ? '🔄 Syncing...' : '🔄 Sync Recent Data'}
          </button>
        </div>
        
        {recentHistoryData && Array.isArray(recentHistoryData) && recentHistoryData.length > 0 ? (
          <div className="space-y-4">
            {recentHistoryData.map((day: HistoryDay) => (
              <div key={day._id} className="nb-panel p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">📅 {day.date}</h3>
                  <span className="text-sm text-gray-500">
                    {day.observations.length} observations
                  </span>
                </div>
                {day.observations.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-bold">🌡️ Avg Temp</p>
                      <p>{calculateAverage(day.observations, 'temperature')}°C</p>
                    </div>
                    <div>
                      <p className="font-bold">💧 Avg Humidity</p>
                      <p>{calculateAverage(day.observations, 'humidity')}%</p>
                    </div>
                    <div>
                      <p className="font-bold">💨 Avg Wind</p>
                      <p>{calculateAverage(day.observations, 'wind_speed')} m/s</p>
                    </div>
                    <div>
                      <p className="font-bold">🌊 Avg Pressure</p>
                      <p>{calculateAverage(day.observations, 'pressure')} hPa</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No historical data available</p>
            <button
              onClick={onSyncData}
              disabled={isSyncing}
              className="nb-button-accent px-4 py-2 font-bold"
            >
              {isSyncing ? 'Syncing...' : 'Sync Historical Data'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}