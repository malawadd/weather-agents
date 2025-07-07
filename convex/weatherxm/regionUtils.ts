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
  if (lat >= 34.8 && lat <= 41.8 && lon >= 19.3 && lon <= 28.2) return 'Greece';
  if (lat >= 45.1 && lat <= 46.9 && lon >= 13.4 && lon <= 16.6) return 'Slovenia';
  if (lat >= 42.4 && lat <= 46.5 && lon >= 13.4 && lon <= 19.4) return 'Croatia';
  if (lat >= 38.8 && lat <= 42.7 && lon >= -9.5 && lon <= -6.2) return 'Portugal';
  if (lat >= 53.1 && lat <= 56.2 && lon >= -10.5 && lon <= -5.4) return 'Ireland';
  if (lat >= 64.0 && lat <= 66.6 && lon >= -25.0 && lon <= -13.5) return 'Iceland';
  if (lat >= 46.2 && lat <= 49.0 && lon >= 6.0 && lon <= 10.5) return 'Liechtenstein';
  if (lat >= 49.4 && lat <= 50.2 && lon >= 5.7 && lon <= 6.5) return 'Luxembourg';
  if (lat >= 43.9 && lat <= 44.0 && lon >= 12.4 && lon <= 12.5) return 'San Marino';
  if (lat >= 41.9 && lat <= 41.9 && lon >= 12.4 && lon <= 12.5) return 'Vatican City';
  if (lat >= 43.7 && lat <= 43.8 && lon >= 7.4 && lon <= 7.4) return 'Monaco';
  if (lat >= 42.5 && lat <= 42.6 && lon >= 1.4 && lon <= 1.8) return 'Andorra';
  if (lat >= 47.0 && lat <= 47.3 && lon >= 9.5 && lon <= 9.6) return 'Liechtenstein';
  if (lat >= 35.1 && lat <= 35.7 && lon >= 32.3 && lon <= 34.6) return 'Cyprus';
  if (lat >= 35.8 && lat <= 35.9 && lon >= 14.2 && lon <= 14.6) return 'Malta';
  if (lat >= 56.3 && lat <= 58.4 && lon >= 21.0 && lon <= 28.2) return 'Estonia';
  if (lat >= 55.7 && lat <= 58.1 && lon >= 20.9 && lon <= 28.2) return 'Latvia';
  if (lat >= 53.9 && lat <= 56.4 && lon >= 20.9 && lon <= 26.8) return 'Lithuania';
  if (lat >= 42.6 && lat <= 46.2 && lon >= 13.4 && lon <= 19.4) return 'Bosnia and Herzegovina';
  if (lat >= 42.2 && lat <= 43.6 && lon >= 18.4 && lon <= 23.0) return 'Montenegro';
  if (lat >= 41.9 && lat <= 43.3 && lon >= 19.3 && lon <= 21.0) return 'Albania';
  if (lat >= 41.2 && lat <= 42.4 && lon >= 20.5 && lon <= 23.0) return 'North Macedonia';
  if (lat >= 42.2 && lat <= 46.2 && lon >= 13.4 && lon <= 23.0) return 'Serbia';
  if (lat >= 48.0 && lat <= 49.6 && lon >= 16.8 && lon <= 22.6) return 'Slovakia';
  if (lat >= 45.4 && lat <= 48.6 && lon >= 22.1 && lon <= 29.7) return 'Moldova';
  if (lat >= 45.9 && lat <= 52.4 && lon >= 22.1 && lon <= 40.2) return 'Ukraine';
  if (lat >= 51.3 && lat <= 56.2 && lon >= 23.2 && lon <= 32.8) return 'Belarus';
  if (lat >= 55.7 && lat <= 69.1 && lon >= 20.0 && lon <= 180.0) return 'Russia';

  // NORTH AMERICA - Comprehensive coverage
  if (lat >= 24.4 && lat <= 49.4 && lon >= -125.0 && lon <= -66.9) return 'United States';
  if (lat >= 41.7 && lat <= 83.1 && lon >= -141.0 && lon <= -52.6) return 'Canada';
  if (lat >= 14.5 && lat <= 32.7 && lon >= -118.4 && lon <= -86.7) return 'Mexico';
  if (lat >= 7.2 && lat <= 18.5 && lon >= -109.5 && lon <= -77.2) return 'Guatemala';
  if (lat >= 12.9 && lat <= 17.8 && lon >= -90.1 && lon <= -87.7) return 'Belize';
  if (lat >= 12.0 && lat <= 16.0 && lon >= -89.4 && lon <= -83.1) return 'El Salvador';
  if (lat >= 10.7 && lat <= 15.0 && lon >= -87.7 && lon <= -82.5) return 'Nicaragua';
  if (lat >= 8.0 && lat <= 11.2 && lon >= -85.9 && lon <= -82.6) return 'Costa Rica';
  if (lat >= 7.2 && lat <= 9.6 && lon >= -83.1 && lon <= -77.2) return 'Panama';
  if (lat >= 17.9 && lat <= 19.9 && lon >= -78.4 && lon <= -68.3) return 'Jamaica';
  if (lat >= 19.9 && lat <= 20.2 && lon >= -74.5 && lon <= -71.6) return 'Haiti';
  if (lat >= 17.6 && lat <= 19.9 && lon >= -72.0 && lon <= -68.3) return 'Dominican Republic';
  if (lat >= 21.4 && lat <= 23.3 && lon >= -81.2 && lon <= -74.1) return 'Cuba';
  if (lat >= 25.0 && lat <= 27.3 && lon >= -79.3 && lon <= -72.7) return 'Bahamas';

  // ASIA - Comprehensive coverage
  if (lat >= 18.2 && lat <= 53.6 && lon >= 73.7 && lon <= 135.1) return 'China';
  if (lat >= 24.4 && lat <= 45.5 && lon >= 129.0 && lon <= 145.8) return 'Japan';
  if (lat >= 33.1 && lat <= 38.6 && lon >= 124.6 && lon <= 131.9) return 'South Korea';
  if (lat >= 37.7 && lat <= 43.0 && lon >= 124.3 && lon <= 130.7) return 'North Korea';
  if (lat >= 6.0 && lat <= 37.1 && lon >= 68.2 && lon <= 97.4) return 'India';
  if (lat >= 23.7 && lat <= 26.6 && lon >= 88.0 && lon <= 92.7) return 'Bangladesh';
  if (lat >= 26.3 && lat <= 30.4 && lon >= 80.1 && lon <= 88.2) return 'Nepal';
  if (lat >= 27.0 && lat <= 28.3 && lon >= 88.7 && lon <= 92.1) return 'Bhutan';
  if (lat >= 5.9 && lat <= 9.8 && lon >= 79.7 && lon <= 81.9) return 'Sri Lanka';
  if (lat >= 23.0 && lat <= 26.8 && lon >= 92.2 && lon <= 101.2) return 'Myanmar';
  if (lat >= 5.6 && lat <= 28.5 && lon >= 92.2 && lon <= 101.2) return 'Thailand';
  if (lat >= 8.6 && lat <= 23.4 && lon >= 102.1 && lon <= 109.5) return 'Vietnam';
  if (lat >= 10.4 && lat <= 14.7 && lon >= 102.3 && lon <= 107.6) return 'Cambodia';
  if (lat >= 13.9 && lat <= 22.5 && lon >= 100.1 && lon <= 107.6) return 'Laos';
  if (lat >= 1.3 && lat <= 5.5 && lon >= 95.0 && lon <= 141.0) return 'Indonesia';
  if (lat >= 1.0 && lat <= 7.4 && lon >= 99.6 && lon <= 119.3) return 'Malaysia';
  if (lat >= 1.2 && lat <= 1.5 && lon >= 103.6 && lon <= 104.0) return 'Singapore';
  if (lat >= 4.6 && lat <= 21.2 && lon >= 114.1 && lon <= 126.6) return 'Philippines';
  if (lat >= 8.2 && lat <= 23.4 && lon >= 92.2 && lon <= 101.2) return 'Myanmar';
  if (lat >= 35.8 && lat <= 42.1 && lon >= 26.0 && lon <= 45.0) return 'Turkey';
  if (lat >= 32.0 && lat <= 37.4 && lon >= 44.2 && lon <= 48.6) return 'Iraq';
  if (lat >= 29.3 && lat <= 38.8 && lon >= 44.0 && lon <= 63.3) return 'Iran';
  if (lat >= 24.0 && lat <= 42.0 && lon >= 34.9 && lon <= 48.8) return 'Syria';
  if (lat >= 33.1 && lat <= 37.3 && lon >= 35.1 && lon <= 42.4) return 'Lebanon';
  if (lat >= 31.2 && lat <= 33.4 && lon >= 34.3 && lon <= 35.9) return 'Israel';
  if (lat >= 31.4 && lat <= 32.6 && lon >= 34.9 && lon <= 35.6) return 'Palestine';
  if (lat >= 16.0 && lat <= 32.2 && lon >= 34.9 && lon <= 55.7) return 'Saudi Arabia';
  if (lat >= 22.5 && lat <= 26.1 && lon >= 51.0 && lon <= 56.4) return 'United Arab Emirates';
  if (lat >= 25.0 && lat <= 26.3 && lon >= 50.4 && lon <= 51.6) return 'Qatar';
  if (lat >= 25.5 && lat <= 26.3 && lon >= 50.4 && lon <= 50.8) return 'Bahrain';
  if (lat >= 29.0 && lat <= 30.1 && lon >= 47.7 && lon <= 48.4) return 'Kuwait';
  if (lat >= 16.0 && lat <= 18.9 && lon >= 42.6 && lon <= 54.5) return 'Yemen';
  if (lat >= 12.0 && lat <= 18.0 && lon >= 42.4 && lon <= 52.4) return 'Oman';
  if (lat >= 35.7 && lat <= 40.4 && lon >= 38.8 && lon <= 46.6) return 'Armenia';
  if (lat >= 38.4 && lat <= 41.9 && lon >= 44.8 && lon <= 50.4) return 'Azerbaijan';
  if (lat >= 41.1 && lat <= 43.6 && lon >= 39.9 && lon <= 46.7) return 'Georgia';
  if (lat >= 36.0 && lat <= 43.2 && lon >= 58.1 && lon <= 75.2) return 'Afghanistan';
  if (lat >= 23.9 && lat <= 37.1 && lon >= 60.9 && lon <= 77.8) return 'Pakistan';
  if (lat >= 35.0 && lat <= 41.0 && lon >= 66.2 && lon <= 75.2) return 'Tajikistan';
  if (lat >= 37.2 && lat <= 43.3 && lon >= 55.4 && lon <= 73.6) return 'Uzbekistan';
  if (lat >= 35.1 && lat <= 43.3 && lon >= 46.5 && lon <= 87.3) return 'Kazakhstan';
  if (lat >= 39.2 && lat <= 43.3 && lon >= 69.3 && lon <= 80.3) return 'Kyrgyzstan';
  if (lat >= 35.1 && lat <= 42.8 && lon >= 52.5 && lon <= 66.7) return 'Turkmenistan';
  if (lat >= 41.8 && lat <= 48.0 && lon >= 74.0 && lon <= 87.3) return 'Mongolia';

  // AFRICA - Comprehensive coverage
  if (lat >= 22.0 && lat <= 31.7 && lon >= 25.0 && lon <= 37.0) return 'Egypt';
  if (lat >= 8.7 && lat <= 22.0 && lon >= 21.8 && lon <= 38.6) return 'Sudan';
  if (lat >= 3.4 && lat <= 14.9 && lon >= 21.0 && lon <= 47.0) return 'South Sudan';
  if (lat >= 9.0 && lat <= 23.0 && lon >= -17.5 && lon <= 12.0) return 'Libya';
  if (lat >= 18.9 && lat <= 37.3 && lon >= -17.1 && lon <= -1.0) return 'Morocco';
  if (lat >= 19.0 && lat <= 37.1 && lon >= -8.7 && lon <= 12.0) return 'Algeria';
  if (lat >= 30.2 && lat <= 37.5 && lon >= 7.5 && lon <= 11.6) return 'Tunisia';
  if (lat >= -34.8 && lat <= -22.1 && lon >= 16.5 && lon <= 32.9) return 'South Africa';
  if (lat >= -26.9 && lat <= -17.8 && lon >= 20.0 && lon <= 29.4) return 'Botswana';
  if (lat >= -22.7 && lat <= -16.9 && lon >= 11.7 && lon <= 25.3) return 'Namibia';
  if (lat >= -30.6 && lat <= -25.2 && lon >= 27.0 && lon <= 32.9) return 'Lesotho';
  if (lat >= -27.3 && lat <= -25.7 && lon >= 31.0 && lon <= 32.1) return 'Eswatini';
  if (lat >= -26.9 && lat <= -15.6 && lon >= 25.2 && lon <= 33.7) return 'Zimbabwe';
  if (lat >= -22.4 && lat <= -9.4 && lon >= 12.2 && lon <= 24.1) return 'Angola';
  if (lat >= -18.1 && lat <= -8.2 && lon >= 21.0 && lon <= 30.3) return 'Zambia';
  if (lat >= -13.5 && lat <= -9.4 && lon >= 28.0 && lon <= 35.9) return 'Malawi';
  if (lat >= -25.7 && lat <= -15.5 && lon >= 30.2 && lon <= 40.8) return 'Mozambique';
  if (lat >= -11.7 && lat <= -1.0 && lon >= 29.3 && lon <= 40.4) return 'Tanzania';
  if (lat >= -4.7 && lat <= 4.2 && lon >= 29.6 && lon <= 35.0) return 'Kenya';
  if (lat >= -1.5 && lat <= 4.2 && lon >= 29.6 && lon <= 35.0) return 'Uganda';
  if (lat >= -2.8 && lat <= -1.0 && lon >= 28.9 && lon <= 30.9) return 'Rwanda';
  if (lat >= -4.5 && lat <= -2.3 && lon >= 29.0 && lon <= 30.8) return 'Burundi';
  if (lat >= -13.5 && lat <= 5.4 && lon >= 12.2 && lon <= 31.2) return 'Democratic Republic of the Congo';
  if (lat >= -5.0 && lat <= 3.7 && lon >= 11.2 && lon <= 18.6) return 'Republic of the Congo';
  if (lat >= -3.4 && lat <= 2.3 && lon >= 9.3 && lon <= 16.2) return 'Gabon';
  if (lat >= 0.4 && lat <= 2.3 && lon >= 9.3 && lon <= 11.3) return 'Equatorial Guinea';
  if (lat >= 1.7 && lat <= 7.4 && lon >= 8.5 && lon <= 16.2) return 'Cameroon';
  if (lat >= 2.2 && lat <= 13.9 && lon >= 5.5 && lon <= 14.7) return 'Chad';
  if (lat >= 2.2 && lat <= 11.0 && lon >= 14.4 && lon <= 27.4) return 'Central African Republic';
  if (lat >= 4.4 && lat <= 15.1 && lon >= -5.5 && lon <= 4.3) return 'Nigeria';
  if (lat >= 4.7 && lat <= 11.2 && lon >= -8.6 && lon <= 0.3) return 'Ghana';
  if (lat >= 4.3 && lat <= 10.7 && lon >= -11.5 && lon <= -2.5) return 'Ivory Coast';
  if (lat >= 7.0 && lat <= 12.7 && lon >= -13.8 && lon <= -7.6) return 'Liberia';
  if (lat >= 6.9 && lat <= 12.5 && lon >= -15.1 && lon <= -10.8) return 'Sierra Leone';
  if (lat >= 7.1 && lat <= 12.7 && lon >= -16.8 && lon <= -11.4) return 'Guinea';
  if (lat >= 11.0 && lat <= 12.7 && lon >= -16.7 && lon <= -13.6) return 'Guinea-Bissau';
  if (lat >= 12.3 && lat <= 16.7 && lon >= -17.5 && lon <= -11.4) return 'Senegal';
  if (lat >= 13.1 && lat <= 17.1 && lon >= -17.1 && lon <= -4.8) return 'Mauritania';
  if (lat >= 10.2 && lat <= 25.0 && lon >= -5.5 && lon <= 4.3) return 'Mali';
  if (lat >= 9.4 && lat <= 15.1 && lon >= -5.5 && lon <= 2.4) return 'Burkina Faso';
  if (lat >= 6.0 && lat <= 15.1 && lon >= -0.2 && lon <= 3.8) return 'Togo';
  if (lat >= 6.2 && lat <= 12.4 && lon >= 0.8 && lon <= 3.8) return 'Benin';
  if (lat >= 11.7 && lat <= 23.5 && lon >= 2.2 && lon <= 16.0) return 'Niger';
  if (lat >= 3.2 && lat <= 23.5 && lon >= 13.5 && lon <= 24.0) return 'Chad';
  if (lat >= 8.5 && lat <= 22.2 && lon >= 33.9 && lon <= 38.6) return 'Ethiopia';
  if (lat >= 3.4 && lat <= 14.9 && lon >= 33.0 && lon <= 48.0) return 'Somalia';
  if (lat >= 11.6 && lat <= 18.0 && lon >= 36.4 && lon <= 43.4) return 'Djibouti';
  if (lat >= 12.4 && lat <= 18.0 && lon >= 36.4 && lon <= 43.1) return 'Eritrea';

  // SOUTH AMERICA - Comprehensive coverage
  if (lat >= -33.8 && lat <= 5.3 && lon >= -73.6 && lon <= -34.8) return 'Brazil';
  if (lat >= -55.0 && lat <= -21.8 && lon >= -73.6 && lon <= -53.6) return 'Argentina';
  if (lat >= -56.0 && lat <= -17.5 && lon >= -81.3 && lon <= -66.4) return 'Chile';
  if (lat >= -58.4 && lat <= -19.3 && lon >= -69.6 && lon <= -51.1) return 'Uruguay';
  if (lat >= -23.0 && lat <= -19.3 && lon >= -65.6 && lon <= -57.6) return 'Paraguay';
  if (lat >= -22.9 && lat <= -9.7 && lon >= -69.6 && lon <= -57.5) return 'Bolivia';
  if (lat >= -18.3 && lat <= 0.0 && lon >= -81.3 && lon <= -68.7) return 'Peru';
  if (lat >= -4.2 && lat <= 1.5 && lon >= -81.1 && lon <= -75.2) return 'Ecuador';
  if (lat >= -4.2 && lat <= 12.6 && lon >= -81.7 && lon <= -66.9) return 'Colombia';
  if (lat >= 0.6 && lat <= 12.2 && lon >= -73.4 && lon <= -59.8) return 'Venezuela';
  if (lat >= 1.3 && lat <= 8.6 && lon >= -61.4 && lon <= -56.5) return 'Guyana';
  if (lat >= 1.8 && lat <= 6.0 && lon >= -58.1 && lon <= -53.9) return 'Suriname';
  if (lat >= 2.1 && lat <= 5.8 && lon >= -54.6 && lon <= -51.6) return 'French Guiana';

  // OCEANIA - Comprehensive coverage
  if (lat >= -43.6 && lat <= -10.7 && lon >= 113.2 && lon <= 153.6) return 'Australia';
  if (lat >= -47.3 && lat <= -34.4 && lon >= 166.4 && lon <= 178.5) return 'New Zealand';
  if (lat >= -22.4 && lat <= -15.9 && lon >= 162.1 && lon <= 167.1) return 'New Caledonia';
  if (lat >= -20.2 && lat <= -12.5 && lon >= 158.1 && lon <= 167.0) return 'Vanuatu';
  if (lat >= -18.3 && lat <= -9.4 && lon >= 138.8 && lon <= 150.0) return 'Papua New Guinea';
  if (lat >= -10.7 && lat <= -6.0 && lon >= 155.5 && lon <= 162.4) return 'Solomon Islands';
  if (lat >= -12.5 && lat <= -5.6 && lon >= 177.8 && lon <= 180.0) return 'Fiji';
  if (lat >= -21.5 && lat <= -18.1 && lon >= -159.8 && lon <= -154.8) return 'Cook Islands';
  if (lat >= -25.1 && lat <= -15.6 && lon >= -178.4 && lon <= -176.2) return 'Tonga';
  if (lat >= -14.4 && lat <= -13.2 && lon >= -176.2 && lon <= -169.4) return 'Samoa';

  // CARIBBEAN - Additional coverage
  if (lat >= 12.0 && lat <= 12.2 && lon >= -61.9 && lon <= -61.0) return 'Grenada';
  if (lat >= 13.1 && lat <= 13.4 && lon >= -61.5 && lon <= -61.0) return 'Saint Vincent and the Grenadines';
  if (lat >= 13.0 && lat <= 14.1 && lon >= -61.2 && lon <= -60.8) return 'Saint Lucia';
  if (lat >= 15.2 && lat <= 15.6 && lon >= -61.6 && lon <= -61.0) return 'Dominica';
  if (lat >= 16.0 && lat <= 16.5 && lon >= -62.9 && lon <= -62.1) return 'Montserrat';
  if (lat >= 17.1 && lat <= 17.7 && lon >= -62.9 && lon <= -62.5) return 'Antigua and Barbuda';
  if (lat >= 17.0 && lat <= 17.4 && lon >= -62.9 && lon <= -62.5) return 'Saint Kitts and Nevis';
  if (lat >= 18.0 && lat <= 18.5 && lon >= -64.9 && lon <= -64.3) return 'British Virgin Islands';
  if (lat >= 18.3 && lat <= 18.4 && lon >= -65.0 && lon <= -64.6) return 'US Virgin Islands';
  if (lat >= 18.2 && lat <= 18.8 && lon >= -67.3 && lon <= -65.2) return 'Puerto Rico';
  if (lat >= 12.0 && lat <= 12.8 && lon >= -68.4 && lon <= -68.2) return 'Aruba';
  if (lat >= 12.0 && lat <= 12.4 && lon >= -69.2 && lon <= -68.7) return 'Curacao';
  if (lat >= 10.4 && lat <= 11.9 && lon >= -64.9 && lon <= -60.9) return 'Trinidad and Tobago';
  if (lat >= 13.0 && lat <= 13.9 && lon >= -61.5 && lon <= -59.4) return 'Barbados';

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