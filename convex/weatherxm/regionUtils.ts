// Enhanced region and country detection with better coverage
export function getRegionFromCoordinates(lat: number, lon: number): string {
  // Europe (expanded coverage)
  if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 40) {
    return 'Europe';
  }
  // North America (including Central America)
  if (lat >= 7 && lat <= 83 && lon >= -168 && lon <= -52) {
    return 'North America';
  }
  // Asia (expanded coverage)
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
  // European countries (more precise boundaries)
  if (lat >= 47.3 && lat <= 55.1 && lon >= 5.9 && lon <= 15.0) return 'Germany';
  if (lat >= 42.3 && lat <= 51.1 && lon >= -4.8 && lon <= 8.2) return 'France';
  if (lat >= 35.5 && lat <= 47.1 && lon >= 6.6 && lon <= 18.5) return 'Italy';
  if (lat >= 35.2 && lat <= 43.8 && lon >= -9.3 && lon <= 4.3) return 'Spain';
  if (lat >= 49.9 && lat <= 60.9 && lon >= -8.2 && lon <= 1.8) return 'United Kingdom';
  if (lat >= 50.8 && lat <= 53.6 && lon >= 3.4 && lon <= 7.2) return 'Netherlands';
  if (lat >= 49.5 && lat <= 51.5 && lon >= 2.5 && lon <= 6.4) return 'Belgium';
  if (lat >= 45.8 && lat <= 47.8 && lon >= 5.9 && lon <= 10.5) return 'Switzerland';
  if (lat >= 46.4 && lat <= 49.0 && lon >= 9.5 && lon <= 17.2) return 'Austria';
  if (lat >= 55.3 && lat <= 71.2 && lon >= 4.6 && lon <= 31.3) return 'Norway';
  if (lat >= 55.3 && lat <= 69.1 && lon >= 11.0 && lon <= 24.2) return 'Sweden';
  if (lat >= 54.6 && lat <= 69.1 && lon >= 8.1 && lon <= 15.2) return 'Denmark';
  if (lat >= 59.7 && lat <= 70.1 && lon >= 19.1 && lon <= 31.6) return 'Finland';
  if (lat >= 48.1 && lat <= 54.8 && lon >= 14.1 && lon <= 24.1) return 'Poland';
  if (lat >= 48.5 && lat <= 51.1 && lon >= 12.1 && lon <= 23.0) return 'Czech Republic';
  if (lat >= 45.7 && lat <= 49.6 && lon >= 16.8 && lon <= 22.9) return 'Hungary';
  if (lat >= 43.6 && lat <= 48.3 && lon >= 20.3 && lon <= 29.7) return 'Romania';
  if (lat >= 41.2 && lat <= 44.2 && lon >= 22.4 && lon <= 28.6) return 'Bulgaria';
  if (lat >= 39.6 && lat <= 42.6 && lon >= 19.3 && lon <= 21.0) return 'Greece';
  if (lat >= 45.1 && lat <= 46.9 && lon >= 13.4 && lon <= 16.6) return 'Slovenia';
  if (lat >= 42.4 && lat <= 46.5 && lon >= 13.4 && lon <= 19.4) return 'Croatia';
  
  // North American countries
  if (lat >= 24.4 && lat <= 49.4 && lon >= -125.0 && lon <= -66.9) return 'United States';
  if (lat >= 41.7 && lat <= 83.1 && lon >= -141.0 && lon <= -52.6) return 'Canada';
  if (lat >= 14.5 && lat <= 32.7 && lon >= -118.4 && lon <= -86.7) return 'Mexico';
  
  // Asian countries
  if (lat >= 18.2 && lat <= 53.6 && lon >= 73.7 && lon <= 135.1) return 'China';
  if (lat >= 24.4 && lat <= 45.5 && lon >= 129.0 && lon <= 145.8) return 'Japan';
  if (lat >= 33.1 && lat <= 38.6 && lon >= 124.6 && lon <= 131.9) return 'South Korea';
  if (lat >= 6.0 && lat <= 37.1 && lon >= 68.2 && lon <= 97.4) return 'India';
  if (lat >= 35.8 && lat <= 42.1 && lon >= 26.0 && lon <= 45.0) return 'Turkey';
  
  // African countries
  if (lat >= 22.0 && lat <= 31.7 && lon >= 25.0 && lon <= 37.0) return 'Egypt';
  if (lat >= -34.8 && lat <= -22.1 && lon >= 16.5 && lon <= 32.9) return 'South Africa';
  if (lat >= 4.6 && lat <= 37.3 && lon >= -17.5 && lon <= 12.0) return 'Morocco';
  
  // South American countries
  if (lat >= -33.8 && lat <= -21.8 && lon >= -73.6 && lon <= -53.1) return 'Brazil';
  if (lat >= -55.0 && lat <= -21.8 && lon >= -73.6 && lon <= -53.6) return 'Argentina';
  if (lat >= -56.0 && lat <= -17.5 && lon >= -81.3 && lon <= -66.4) return 'Chile';
  
  // Oceania
  if (lat >= -43.6 && lat <= -10.7 && lon >= 113.2 && lon <= 153.6) return 'Australia';
  if (lat >= -47.3 && lat <= -34.4 && lon >= 166.4 && lon <= 178.5) return 'New Zealand';
  
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