import { matchesLocationSearch } from './regionUtils';
import { TransformedStation } from './stationTransform';

export interface FilterOptions {
  search?: string;
  region?: string;
  country?: string;
}

export function applyStationFilters(
  stations: TransformedStation[], 
  filters: FilterOptions
): TransformedStation[] {
  let filtered = [...stations];

  // Apply search filter (supports location names)
  if (filters.search) {
    filtered = filtered.filter(station => 
      matchesLocationSearch(station, filters.search!)
    );
  }

  // Apply region filter
  if (filters.region && filters.region !== 'All') {
    filtered = filtered.filter(station => 
      station.region === filters.region
    );
  }

  // Apply country filter
  if (filters.country && filters.country !== 'All') {
    filtered = filtered.filter(station => 
      station.country === filters.country
    );
  }

  return filtered;
}

export function paginateStations(
  stations: TransformedStation[], 
  page: number, 
  limit: number
) {
  const startIndex = (page - 1) * limit;
  const paginatedStations = stations.slice(startIndex, startIndex + limit);
  
  return {
    data: paginatedStations,
    total: stations.length,
    page: page,
    totalPages: Math.ceil(stations.length / limit),
    hasMore: startIndex + limit < stations.length,
  };
}