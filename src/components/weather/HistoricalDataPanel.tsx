import React, { useState } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { DatePicker } from './DatePicker';
import { ObservationsList } from './ObservationsList';

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
  summary?: {
    totalObservations: number;
    validObservations: number;
    avgTemperature?: number;
    minTemperature?: number;
    maxTemperature?: number;
    avgHumidity?: number;
    avgWindSpeed?: number;
    maxWindSpeed?: number;
    avgPressure?: number;
    totalPrecipitation?: number;
    maxUvIndex?: number;
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
  const [showObservations, setShowObservations] = useState(false);

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
    setShowObservations(false);
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

  const formatValue = (value?: number, decimals = 1) => {
    return value !== undefined && value !== null ? value.toFixed(decimals) : 'N/A';
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
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">📊 Data for {selectedDate}</h3>
                  {specificDateData.summary && (
                    <span className="text-xs text-gray-600">
                      {specificDateData.summary.validObservations} / {specificDateData.summary.totalObservations} valid observations
                    </span>
                  )}
                </div>
                
                {specificDateData.observations && specificDateData.observations.length > 0 ? (
                  <div className="space-y-4">
                    {/* Summary Statistics */}
                    {specificDateData.summary && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="nb-panel-white p-3">
                          <p className="font-bold">🌡️ Temperature</p>
                          <p>Avg: {formatValue(specificDateData.summary.avgTemperature)}°C</p>
                          <p className="text-xs">
                            {formatValue(specificDateData.summary.minTemperature)}° - {formatValue(specificDateData.summary.maxTemperature)}°
                          </p>
                        </div>
                        <div className="nb-panel-white p-3">
                          <p className="font-bold">💧 Humidity</p>
                          <p>Avg: {formatValue(specificDateData.summary.avgHumidity)}%</p>
                        </div>
                        <div className="nb-panel-white p-3">
                          <p className="font-bold">💨 Wind</p>
                          <p>Avg: {formatValue(specificDateData.summary.avgWindSpeed)} m/s</p>
                          <p className="text-xs">Max: {formatValue(specificDateData.summary.maxWindSpeed)} m/s</p>
                        </div>
                        <div className="nb-panel-white p-3">
                          <p className="font-bold">🌊 Pressure</p>
                          <p>Avg: {formatValue(specificDateData.summary.avgPressure)} hPa</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Toggle Observations View */}
                    <div className="text-center">
                      <button
                        onClick={() => setShowObservations(!showObservations)}
                        className="nb-button px-4 py-2 font-bold text-sm"
                      >
                        {showObservations ? '📊 Hide Detailed Observations' : `📊 Show All ${specificDateData.observations.length} Observations`}
                      </button>
                    </div>
                    
                    {/* Detailed Observations */}
                    {showObservations && (
                      <ObservationsList observations={specificDateData.observations} />
                    )}
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
                  <div className="text-sm text-gray-500">
                    {day.summary ? (
                      <span>{day.summary.validObservations} / {day.summary.totalObservations} valid observations</span>
                    ) : (
                      <span>{day.observations.length} observations</span>
                    )}
                  </div>
                </div>
                
                {day.summary ? (
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-bold">🌡️ Temperature</p>
                      <p>{formatValue(day.summary.avgTemperature)}°C avg</p>
                      <p className="text-xs">{formatValue(day.summary.minTemperature)}° - {formatValue(day.summary.maxTemperature)}°</p>
                    </div>
                    <div>
                      <p className="font-bold">💧 Humidity</p>
                      <p>{formatValue(day.summary.avgHumidity)}% avg</p>
                    </div>
                    <div>
                      <p className="font-bold">💨 Wind</p>
                      <p>{formatValue(day.summary.avgWindSpeed)} m/s avg</p>
                      <p className="text-xs">Max: {formatValue(day.summary.maxWindSpeed)} m/s</p>
                    </div>
                    <div>
                      <p className="font-bold">🌊 Pressure</p>
                      <p>{formatValue(day.summary.avgPressure)} hPa avg</p>
                    </div>
                  </div>
                ) : day.observations.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Raw observations available - sync to calculate statistics
                  </p>
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