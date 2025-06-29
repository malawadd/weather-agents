// Helper functions for region and location detection
export function getRegionFromCoordinates(lat: number, lon: number): string {
  // Europe
  if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 40) {
    return 'Europe';
  }
  // North America
  if (lat >= 25 && lat <= 72 && lon >= -168 && lon <= -52) {
    return 'North America';
  }
  // Asia
  if (lat >= -11 && lat <= 81 && lon >= 25 && lon <= 180) {
    return 'Asia';
  }
  // Africa
  if (lat >= -35 && lat <= 37 && lon >= -20 && lon <= 55) {
    return 'Africa';
  }
  // Australia/Oceania
  if (lat >= -47 && lat <= -10 && lon >= 113 && lon <= 180) {
    return 'Australia';
  }
  // South America
  if (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) {
    return 'South America';
  }
  
  return 'Other';
}

export function getCountryFromCoordinates(lat: number, lon: number): string {
  // European countries
  if (lat >= 47.3 && lat <= 55.1 && lon >= 5.9 && lon <= 15.0) return 'Germany';
  if (lat >= 41.4 && lat <= 51.1 && lon >= -5.1 && lon <= 9.6) return 'France';
  if (lat >= 36.0 && lat <= 46.2 && lon >= 6.6 && lon <= 18.5) return 'Italy';
  if (lat >= 35.9 && lat <= 43.8 && lon >= -9.5 && lon <= 3.3) return 'Spain';
  if (lat >= 49.9 && lat <= 60.9 && lon >= -8.2 && lon <= 1.8) return 'United Kingdom';
  if (lat >= 51.0 && lat <= 53.6 && lon >= 3.4 && lon <= 7.2) return 'Netherlands';
  if (lat >= 50.5 && lat <= 51.5 && lon >= 2.5 && lon <= 6.4) return 'Belgium';
  if (lat >= 46.4 && lat <= 47.8 && lon >= 5.9 && lon <= 10.5) return 'Switzerland';
  if (lat >= 46.4 && lat <= 49.0 && lon >= 9.5 && lon <= 17.2) return 'Austria';
  if (lat >= 55.3 && lat <= 69.1 && lon >= 8.0 && lon <= 31.3) return 'Norway';
  if (lat >= 55.3 && lat <= 69.1 && lon >= 11.0 && lon <= 24.2) return 'Sweden';
  
  // North American countries
  if (lat >= 24.4 && lat <= 49.4 && lon >= -125.0 && lon <= -66.9) return 'United States';
  if (lat >= 41.7 && lat <= 83.1 && lon >= -141.0 && lon <= -52.6) return 'Canada';
  if (lat >= 14.5 && lat <= 32.7 && lon >= -118.4 && lon <= -86.7) return 'Mexico';
  
  // Asian countries
  if (lat >= 20.9 && lat <= 53.6 && lon >= 73.7 && lon <= 135.1) return 'China';
  if (lat >= 24.4 && lat <= 45.5 && lon >= 129.0 && lon <= 145.8) return 'Japan';
  if (lat >= 33.1 && lat <= 38.6 && lon >= 124.6 && lon <= 131.9) return 'South Korea';
  if (lat >= 6.0 && lat <= 37.1 && lon >= 68.2 && lon <= 97.4) return 'India';
  
  return 'Unknown';
}

export function matchesLocationSearch(station: any, searchTerm: string): boolean {
  const term = searchTerm.toLowerCase();
  const country = getCountryFromCoordinates(station.location.lat, station.location.lon);
  const region = getRegionFromCoordinates(station.location.lat, station.location.lon);
  
  return (
    station.name?.toLowerCase().includes(term) ||
    station.id?.toLowerCase().includes(term) ||
    country.toLowerCase().includes(term) ||
    region.toLowerCase().includes(term) ||
    station.location.address?.toLowerCase().includes(term)
  );
}