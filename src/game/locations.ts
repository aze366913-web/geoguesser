export type Loc = {
  name: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
  /** starting zoom for the satellite view */
  z?: number;
};

export const LOCATIONS: Loc[] = [
  // --- Europe ---
  { name: 'Eiffel Tower', country: 'France', continent: 'Europe', lat: 48.8584, lng: 2.2945 },
  { name: 'The Colosseum', country: 'Italy', continent: 'Europe', lat: 41.8902, lng: 12.4922 },
  { name: 'Tower Bridge', country: 'United Kingdom', continent: 'Europe', lat: 51.5055, lng: -0.0754 },
  { name: 'Stonehenge', country: 'United Kingdom', continent: 'Europe', lat: 51.1789, lng: -1.8262, z: 17 },
  { name: 'Sagrada Família', country: 'Spain', continent: 'Europe', lat: 41.4036, lng: 2.1744 },
  { name: 'The Alhambra', country: 'Spain', continent: 'Europe', lat: 37.1761, lng: -3.5881 },
  { name: 'The Acropolis', country: 'Greece', continent: 'Europe', lat: 37.9715, lng: 23.7257 },
  { name: 'Santorini — Oia', country: 'Greece', continent: 'Europe', lat: 36.4618, lng: 25.3753 },
  { name: 'Hagia Sophia', country: 'Türkiye', continent: 'Europe', lat: 41.0086, lng: 28.9802 },
  { name: 'Red Square', country: 'Russia', continent: 'Europe', lat: 55.7539, lng: 37.6208 },
  { name: 'Neuschwanstein Castle', country: 'Germany', continent: 'Europe', lat: 47.5576, lng: 10.7498, z: 17 },
  { name: 'Brandenburg Gate', country: 'Germany', continent: 'Europe', lat: 52.5163, lng: 13.3777 },
  { name: 'Amsterdam Canal Ring', country: 'Netherlands', continent: 'Europe', lat: 52.3702, lng: 4.8852 },
  { name: 'Grand Canal, Venice', country: 'Italy', continent: 'Europe', lat: 45.4383, lng: 12.3326 },
  { name: 'Charles Bridge', country: 'Czechia', continent: 'Europe', lat: 50.0865, lng: 14.4114 },
  { name: 'Hungarian Parliament', country: 'Hungary', continent: 'Europe', lat: 47.5072, lng: 19.0458 },
  { name: 'Schönbrunn Palace', country: 'Austria', continent: 'Europe', lat: 48.1845, lng: 16.3122 },
  { name: 'Nyhavn', country: 'Denmark', continent: 'Europe', lat: 55.6797, lng: 12.5898 },
  { name: 'Gamla Stan', country: 'Sweden', continent: 'Europe', lat: 59.3251, lng: 18.0711 },
  { name: 'Oslo Opera House', country: 'Norway', continent: 'Europe', lat: 59.9075, lng: 10.7533 },
  { name: 'Reykjavík', country: 'Iceland', continent: 'Europe', lat: 64.1466, lng: -21.9426 },
  { name: 'Edinburgh Castle', country: 'United Kingdom', continent: 'Europe', lat: 55.9486, lng: -3.1999 },
  { name: 'Belém Tower', country: 'Portugal', continent: 'Europe', lat: 38.6916, lng: -9.216 },
  { name: 'Old Town Dubrovnik', country: 'Croatia', continent: 'Europe', lat: 42.6407, lng: 18.1077 },
  { name: 'Monte Carlo', country: 'Monaco', continent: 'Europe', lat: 43.7384, lng: 7.4246 },
  { name: 'Lake Zürich', country: 'Switzerland', continent: 'Europe', lat: 47.3669, lng: 8.5417 },
  { name: 'Mont Saint-Michel', country: 'France', continent: 'Europe', lat: 48.636, lng: -1.5115, z: 17 },

  // --- Africa ---
  { name: 'Pyramids of Giza', country: 'Egypt', continent: 'Africa', lat: 29.9792, lng: 31.1342 },
  { name: 'Suez Canal', country: 'Egypt', continent: 'Africa', lat: 30.5852, lng: 32.2654, z: 15 },
  { name: 'Jemaa el-Fnaa', country: 'Morocco', continent: 'Africa', lat: 31.6258, lng: -7.9891 },
  { name: 'V&A Waterfront', country: 'South Africa', continent: 'Africa', lat: -33.9036, lng: 18.4199 },
  { name: 'Victoria Falls', country: 'Zimbabwe', continent: 'Africa', lat: -17.9243, lng: 25.8572, z: 15 },
  { name: 'Victoria Island', country: 'Nigeria', continent: 'Africa', lat: 6.4281, lng: 3.4219 },
  { name: 'Nairobi CBD', country: 'Kenya', continent: 'Africa', lat: -1.2864, lng: 36.8172 },
  { name: 'Addis Ababa', country: 'Ethiopia', continent: 'Africa', lat: 9.032, lng: 38.7469 },
  { name: 'Dakar', country: 'Senegal', continent: 'Africa', lat: 14.6928, lng: -17.4467 },
  { name: 'Stone Town', country: 'Tanzania', continent: 'Africa', lat: -6.1629, lng: 39.1891 },

  // --- Asia / Middle East ---
  { name: 'Taj Mahal', country: 'India', continent: 'Asia', lat: 27.1751, lng: 78.0421 },
  { name: 'India Gate', country: 'India', continent: 'Asia', lat: 28.6129, lng: 77.2295 },
  { name: 'Marine Drive', country: 'India', continent: 'Asia', lat: 18.944, lng: 72.823 },
  { name: 'Burj Khalifa', country: 'UAE', continent: 'Asia', lat: 25.1972, lng: 55.2744 },
  { name: 'Palm Jumeirah', country: 'UAE', continent: 'Asia', lat: 25.1124, lng: 55.139, z: 14 },
  { name: 'Doha Corniche', country: 'Qatar', continent: 'Asia', lat: 25.32, lng: 51.531 },
  { name: 'Petra', country: 'Jordan', continent: 'Asia', lat: 30.3285, lng: 35.4444, z: 17 },
  { name: 'Old City of Jerusalem', country: 'Israel', continent: 'Asia', lat: 31.7781, lng: 35.2356 },
  { name: 'Shibuya Crossing', country: 'Japan', continent: 'Asia', lat: 35.6595, lng: 139.7005, z: 17 },
  { name: 'Mount Fuji', country: 'Japan', continent: 'Asia', lat: 35.3606, lng: 138.7274, z: 14 },
  { name: 'The Forbidden City', country: 'China', continent: 'Asia', lat: 39.9163, lng: 116.3972 },
  { name: 'Great Wall at Badaling', country: 'China', continent: 'Asia', lat: 40.3587, lng: 116.017, z: 16 },
  { name: 'Pudong Skyline', country: 'China', continent: 'Asia', lat: 31.2397, lng: 121.4998 },
  { name: 'Victoria Harbour', country: 'Hong Kong', continent: 'Asia', lat: 22.294, lng: 114.1722 },
  { name: 'Gyeongbokgung Palace', country: 'South Korea', continent: 'Asia', lat: 37.5796, lng: 126.977 },
  { name: 'Marina Bay', country: 'Singapore', continent: 'Asia', lat: 1.2838, lng: 103.8591 },
  { name: 'Angkor Wat', country: 'Cambodia', continent: 'Asia', lat: 13.4125, lng: 103.867, z: 16 },
  { name: 'The Grand Palace', country: 'Thailand', continent: 'Asia', lat: 13.75, lng: 100.4913 },
  { name: 'Monas, Jakarta', country: 'Indonesia', continent: 'Asia', lat: -6.1754, lng: 106.8272 },
  { name: 'Rizal Park', country: 'Philippines', continent: 'Asia', lat: 14.5826, lng: 120.9787 },
  { name: 'Boudhanath Stupa', country: 'Nepal', continent: 'Asia', lat: 27.7215, lng: 85.362, z: 17 },
  { name: 'Malé', country: 'Maldives', continent: 'Asia', lat: 4.1755, lng: 73.5093, z: 15 },
  { name: 'Bosphorus Bridge', country: 'Türkiye', continent: 'Asia', lat: 41.0451, lng: 29.0343 },

  // --- North America ---
  { name: 'Statue of Liberty', country: 'USA', continent: 'North America', lat: 40.6892, lng: -74.0445, z: 17 },
  { name: 'Golden Gate Bridge', country: 'USA', continent: 'North America', lat: 37.8199, lng: -122.4783, z: 15 },
  { name: 'The Las Vegas Strip', country: 'USA', continent: 'North America', lat: 36.1147, lng: -115.1728 },
  { name: 'Grand Canyon', country: 'USA', continent: 'North America', lat: 36.0544, lng: -112.1401, z: 14 },
  { name: 'Hollywood Hills', country: 'USA', continent: 'North America', lat: 34.1341, lng: -118.3215 },
  { name: 'National Mall', country: 'USA', continent: 'North America', lat: 38.8895, lng: -77.0353 },
  { name: 'Millennium Park', country: 'USA', continent: 'North America', lat: 41.8826, lng: -87.6226 },
  { name: 'Kennedy Space Center', country: 'USA', continent: 'North America', lat: 28.5729, lng: -80.649, z: 15 },
  { name: 'Waikīkī', country: 'USA', continent: 'North America', lat: 21.2767, lng: -157.8275 },
  { name: 'CN Tower', country: 'Canada', continent: 'North America', lat: 43.6426, lng: -79.3871 },
  { name: 'Niagara Falls', country: 'Canada', continent: 'North America', lat: 43.0828, lng: -79.0742, z: 16 },
  { name: 'Stanley Park', country: 'Canada', continent: 'North America', lat: 49.3017, lng: -123.1417, z: 14 },
  { name: 'Chichén Itzá', country: 'Mexico', continent: 'North America', lat: 20.6843, lng: -88.5678, z: 17 },
  { name: 'Zócalo, CDMX', country: 'Mexico', continent: 'North America', lat: 19.4326, lng: -99.1332 },
  { name: 'Miraflores Locks', country: 'Panama', continent: 'North America', lat: 8.996, lng: -79.59, z: 15 },
  { name: 'El Capitolio', country: 'Cuba', continent: 'North America', lat: 23.1356, lng: -82.359 },

  // --- South America ---
  { name: 'Christ the Redeemer', country: 'Brazil', continent: 'South America', lat: -22.9519, lng: -43.2105, z: 17 },
  { name: 'Maracanã', country: 'Brazil', continent: 'South America', lat: -22.9121, lng: -43.2302 },
  { name: 'Avenida Paulista', country: 'Brazil', continent: 'South America', lat: -23.5614, lng: -46.6558 },
  { name: 'Machu Picchu', country: 'Peru', continent: 'South America', lat: -13.1631, lng: -72.545, z: 17 },
  { name: 'Miraflores, Lima', country: 'Peru', continent: 'South America', lat: -12.1211, lng: -77.03 },
  { name: 'Obelisco de Buenos Aires', country: 'Argentina', continent: 'South America', lat: -34.6037, lng: -58.3816 },
  { name: 'Iguazú Falls', country: 'Argentina', continent: 'South America', lat: -25.6953, lng: -54.4367, z: 15 },
  { name: 'Salar de Uyuni', country: 'Bolivia', continent: 'South America', lat: -20.1338, lng: -67.4891, z: 13 },
  { name: 'Santiago Centro', country: 'Chile', continent: 'South America', lat: -33.4372, lng: -70.6506 },
  { name: 'Cartagena Old Town', country: 'Colombia', continent: 'South America', lat: 10.4236, lng: -75.5508 },

  // --- Oceania ---
  { name: 'Sydney Opera House', country: 'Australia', continent: 'Oceania', lat: -33.8568, lng: 151.2153, z: 17 },
  { name: 'Uluru', country: 'Australia', continent: 'Oceania', lat: -25.3444, lng: 131.0369, z: 14 },
  { name: 'Melbourne Cricket Ground', country: 'Australia', continent: 'Oceania', lat: -37.82, lng: 144.9834 },
  { name: 'Perth CBD', country: 'Australia', continent: 'Oceania', lat: -31.9523, lng: 115.8613 },
  { name: 'Sky Tower, Auckland', country: 'New Zealand', continent: 'Oceania', lat: -36.8485, lng: 174.7622 },
  { name: 'Bora Bora', country: 'French Polynesia', continent: 'Oceania', lat: -16.5004, lng: -151.7415, z: 13 },
];

export function pickRound(count: number): Loc[] {
  const pool = [...LOCATIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
