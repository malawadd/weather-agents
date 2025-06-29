import React, { useState } from 'react';

interface Observation {
  timestamp: string;
  temperature?: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  wind_direction?: number;
  wind_gust?: number;
  pressure?: number;
  precipitation_rate?: number;
  solar_irradiance?: number;
  uv_index?: number;
  dew_point?: number;
}

interface ObservationsListProps {
  observations: Observation[];
}

export function ObservationsList({ observations }: ObservationsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filter out observations with no valid data
  const validObservations = observations.filter(obs => 
    obs.temperature !== undefined || 
    obs.humidity !== undefined || 
    obs.wind_speed !== undefined || 
    obs.pressure !== undefined ||
    obs.precipitation_rate !== undefined ||
    obs.solar_irradiance !== undefined ||
    obs.uv_index !== undefined
  );

  const totalPages = Math.ceil(validObservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentObservations = validObservations.slice(startIndex, startIndex + itemsPerPage);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatValue = (value?: number, unit = '', decimals = 1) => {
    return value !== undefined && value !== null ? `${value.toFixed(decimals)}${unit}` : '-';
  };

  if (validObservations.length === 0) {
    return (
      <div className="nb-panel-warning p-4 text-center">
        <p className="font-bold">No valid observations found</p>
        <p className="text-sm">All observations contain null values</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold">📊 Detailed Observations ({validObservations.length} valid)</h4>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="nb-button px-2 py-1 text-xs font-bold disabled:opacity-50"
            >
              ←
            </button>
            <span className="text-xs font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="nb-button px-2 py-1 text-xs font-bold disabled:opacity-50"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {currentObservations.map((obs, index) => (
          <div key={startIndex + index} className="nb-panel p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm">⏰ {formatTime(obs.timestamp)}</span>
              <span className="text-xs text-gray-500">
                Observation #{startIndex + index + 1}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
              <div>
                <span className="font-bold">🌡️ Temp:</span>
                <br />
                {formatValue(obs.temperature, '°C')}
                {obs.feels_like && (
                  <div className="text-gray-500">
                    Feels: {formatValue(obs.feels_like, '°C')}
                  </div>
                )}
              </div>
              
              <div>
                <span className="font-bold">💧 Humidity:</span>
                <br />
                {formatValue(obs.humidity, '%', 0)}
              </div>
              
              <div>
                <span className="font-bold">💨 Wind:</span>
                <br />
                {formatValue(obs.wind_speed, ' m/s')}
                {obs.wind_direction && (
                  <div className="text-gray-500">
                    {formatValue(obs.wind_direction, '°', 0)}
                  </div>
                )}
              </div>
              
              <div>
                <span className="font-bold">🌊 Pressure:</span>
                <br />
                {formatValue(obs.pressure, ' hPa', 0)}
              </div>
              
              <div>
                <span className="font-bold">🌧️ Rain:</span>
                <br />
                {formatValue(obs.precipitation_rate, ' mm/h')}
              </div>
              
              <div>
                <span className="font-bold">☀️ UV:</span>
                <br />
                {formatValue(obs.uv_index, '', 0)}
                {obs.solar_irradiance && (
                  <div className="text-gray-500">
                    {formatValue(obs.solar_irradiance, ' W/m²', 0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 py-1 text-xs font-bold ${
                    currentPage === pageNum 
                      ? 'nb-panel-accent' 
                      : 'nb-button'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="text-xs">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-2 py-1 text-xs font-bold ${
                    currentPage === totalPages 
                      ? 'nb-panel-accent' 
                      : 'nb-button'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}