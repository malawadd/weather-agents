// Enhanced region and country detection with comprehensive global coverage
export function getRegionFromCoordinates(lat: number, lon: number): string {
  // Europe (expanded coverage)
  if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 40) {
    return 'Europe';
  }
  // North America (including Central America and Caribbean)
  if (lat >= 7 && lat <= 83 && lon >= -168 && lon <= -52) {
    return 'North America';
  }
  // Asia (expanded coverage including Middle East)
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
  // EUROPE - Comprehensive coverage
  if (lat >= 47.3 && lat <= 55.1 && lon >= 5.9 && lon <= 15.0) return 'Germany';
  if (lat >= 42.3 && lat <= 51.1 && lon >= -4.8 && lon <= 8.2) return 'France';
 
  // NORTH AMERICA - Comprehensive coverage
  if (lat >= 24.4 && lat <= 49.4 && lon >= -125.0 && lon <= -66.9) return 'United States';
  if (lat >= 41.7 && lat <= 83.1 && lon >= -141.0 && lon <= -52.6) return 'Canada';


  // ASIA - Comprehensive coverage
  if (lat >= 18.2 && lat <= 53.6 && lon >= 73.7 && lon <= 135.1) return 'China';
  if (lat >= 24.4 && lat <= 45.5 && lon >= 129.0 && lon <= 145.8) return 'Japan';
  if (lat >= 33.1 && lat <= 38.6 && lon >= 124.6 && lon <= 131.9) return 'South Korea';
  if (lat >= 37.7 && lat <= 43.0 && lon >= 124.3 && lon <= 130.7) return 'North Korea';
  if (lat >= 6.0 && lat <= 37.1 && lon >= 68.2 && lon <= 97.4) return 'India';
  if (lat >= 23.7 && lat <= 26.6 && lon >= 88.0 && lon <= 92.7) return 'Bangladesh';



  return 'Unknown';
}

export function matchesLocationSearch(station: any, searchTerm: string): boolean {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return true;
  
  const country = getCountryFromCoordinates(station.location?.lat || station.lat, station.location?.lon || station.lon);
  const region = getRegionFromCoordinates(station.location?.lat || station.lat, station.location?.lon || station.lon);
  
  // Check multiple fields for matches
  const searchFields = [
    station.name,
    station.id,
    country,
    region,
    station.location?.address,
    station.address
  ].filter(Boolean).map(field => field.toLowerCase());
  
  // Check if any field contains the search term
  return searchFields.some(field => field.includes(term));
}