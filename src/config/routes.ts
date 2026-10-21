export type Place = { name: string; lat: number; lng: number };
export type City = { city: string; places: readonly Place[] };
export type Trip = { city: string; country?: string; generated?: boolean; from: Place; to: Place };

/** Well-known places, grouped by city so a random pair always makes a sensible local trip. */
export const cities: readonly City[] = [
  {
    city: "Delhi",
    places: [
      { name: "India Gate", lat: 28.6129, lng: 77.2295 },
      { name: "Connaught Place", lat: 28.6315, lng: 77.2167 },
      { name: "Red Fort", lat: 28.6562, lng: 77.241 },
      { name: "Lotus Temple", lat: 28.5535, lng: 77.2588 },
      { name: "Qutub Minar", lat: 28.5244, lng: 77.1855 },
    ],
  },
  {
    city: "Mumbai",
    places: [
      { name: "Gateway of India", lat: 18.922, lng: 72.8347 },
      { name: "CSMT Station", lat: 18.9398, lng: 72.8355 },
      { name: "Nariman Point", lat: 18.9256, lng: 72.8242 },
      { name: "Siddhivinayak Temple", lat: 19.017, lng: 72.83 },
      { name: "Juhu Beach", lat: 19.0988, lng: 72.8265 },
    ],
  },
  {
    city: "Bengaluru",
    places: [
      { name: "Cubbon Park", lat: 12.9763, lng: 77.5929 },
      { name: "Lalbagh Garden", lat: 12.9507, lng: 77.5848 },
      { name: "Bangalore Palace", lat: 12.9988, lng: 77.5921 },
      { name: "MG Road", lat: 12.9756, lng: 77.607 },
      { name: "Vidhana Soudha", lat: 12.9796, lng: 77.5907 },
    ],
  },
  {
    city: "Jaipur",
    places: [
      { name: "Hawa Mahal", lat: 26.9239, lng: 75.8267 },
      { name: "City Palace", lat: 26.9258, lng: 75.8237 },
      { name: "Jal Mahal", lat: 26.9535, lng: 75.8466 },
      { name: "Albert Hall Museum", lat: 26.9116, lng: 75.819 },
      { name: "Amber Fort", lat: 26.9855, lng: 75.8513 },
    ],
  },
  {
    city: "Kolkata",
    places: [
      { name: "Howrah Bridge", lat: 22.5851, lng: 88.3468 },
      { name: "Victoria Memorial", lat: 22.5448, lng: 88.3426 },
      { name: "Park Street", lat: 22.5535, lng: 88.351 },
      { name: "Science City", lat: 22.54, lng: 88.3963 },
    ],
  },
  {
    city: "Hyderabad",
    places: [
      { name: "Charminar", lat: 17.3616, lng: 78.4747 },
      { name: "Hussain Sagar", lat: 17.4239, lng: 78.4738 },
      { name: "Golconda Fort", lat: 17.3833, lng: 78.4011 },
      { name: "HITEC City", lat: 17.4435, lng: 78.3772 },
    ],
  },
];

/** Picks a random city, then two different places inside it. */
export function pickRandomTrip(previous?: Trip): Trip {
  let trip: Trip;
  do {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const first = Math.floor(Math.random() * city.places.length);
    let second = Math.floor(Math.random() * (city.places.length - 1));
    if (second >= first) second += 1;
    trip = { city: city.city, from: city.places[first], to: city.places[second] };
  } while (previous && trip.from.name === previous.from.name && trip.to.name === previous.to.name);
  return trip;
}

type Hub = { city: string; lat: number; lng: number };

/** Main city per country (ISO code), used when the visitor is outside India. */
export const hubs: Readonly<Record<string, Hub>> = {
  US: { city: "New York", lat: 40.7128, lng: -74.006 },
  GB: { city: "London", lat: 51.5074, lng: -0.1278 },
  CA: { city: "Toronto", lat: 43.6532, lng: -79.3832 },
  AU: { city: "Sydney", lat: -33.8688, lng: 151.2093 },
  NZ: { city: "Auckland", lat: -36.8485, lng: 174.7633 },
  IE: { city: "Dublin", lat: 53.3498, lng: -6.2603 },
  DE: { city: "Berlin", lat: 52.52, lng: 13.405 },
  FR: { city: "Paris", lat: 48.8566, lng: 2.3522 },
  ES: { city: "Madrid", lat: 40.4168, lng: -3.7038 },
  PT: { city: "Lisbon", lat: 38.7223, lng: -9.1393 },
  IT: { city: "Rome", lat: 41.9028, lng: 12.4964 },
  NL: { city: "Amsterdam", lat: 52.3676, lng: 4.9041 },
  BE: { city: "Brussels", lat: 50.8503, lng: 4.3517 },
  CH: { city: "Zurich", lat: 47.3769, lng: 8.5417 },
  AT: { city: "Vienna", lat: 48.2082, lng: 16.3738 },
  SE: { city: "Stockholm", lat: 59.3293, lng: 18.0686 },
  NO: { city: "Oslo", lat: 59.9139, lng: 10.7522 },
  DK: { city: "Copenhagen", lat: 55.6761, lng: 12.5683 },
  FI: { city: "Helsinki", lat: 60.1699, lng: 24.9384 },
  PL: { city: "Warsaw", lat: 52.2297, lng: 21.0122 },
  CZ: { city: "Prague", lat: 50.0755, lng: 14.4378 },
  HU: { city: "Budapest", lat: 47.4979, lng: 19.0402 },
  RO: { city: "Bucharest", lat: 44.4268, lng: 26.1025 },
  GR: { city: "Athens", lat: 37.9838, lng: 23.7275 },
  UA: { city: "Kyiv", lat: 50.4501, lng: 30.5234 },
  RU: { city: "Moscow", lat: 55.7558, lng: 37.6173 },
  TR: { city: "Istanbul", lat: 41.0082, lng: 28.9784 },
  IL: { city: "Tel Aviv", lat: 32.0853, lng: 34.7818 },
  AE: { city: "Dubai", lat: 25.2048, lng: 55.2708 },
  SA: { city: "Riyadh", lat: 24.7136, lng: 46.6753 },
  QA: { city: "Doha", lat: 25.2854, lng: 51.531 },
  EG: { city: "Cairo", lat: 30.0444, lng: 31.2357 },
  MA: { city: "Casablanca", lat: 33.5731, lng: -7.5898 },
  NG: { city: "Lagos", lat: 6.5244, lng: 3.3792 },
  GH: { city: "Accra", lat: 5.6037, lng: -0.187 },
  KE: { city: "Nairobi", lat: -1.2921, lng: 36.8219 },
  ET: { city: "Addis Ababa", lat: 9.03, lng: 38.74 },
  ZA: { city: "Johannesburg", lat: -26.2041, lng: 28.0473 },
  PK: { city: "Karachi", lat: 24.8607, lng: 67.0011 },
  BD: { city: "Dhaka", lat: 23.8103, lng: 90.4125 },
  LK: { city: "Colombo", lat: 6.9271, lng: 79.8612 },
  NP: { city: "Kathmandu", lat: 27.7172, lng: 85.324 },
  ID: { city: "Jakarta", lat: -6.2088, lng: 106.8456 },
  MY: { city: "Kuala Lumpur", lat: 3.139, lng: 101.6869 },
  SG: { city: "Singapore", lat: 1.3521, lng: 103.8198 },
  TH: { city: "Bangkok", lat: 13.7563, lng: 100.5018 },
  VN: { city: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297 },
  PH: { city: "Manila", lat: 14.5995, lng: 120.9842 },
  JP: { city: "Tokyo", lat: 35.6762, lng: 139.6503 },
  KR: { city: "Seoul", lat: 37.5665, lng: 126.978 },
  CN: { city: "Shanghai", lat: 31.2304, lng: 121.4737 },
  HK: { city: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  TW: { city: "Taipei", lat: 25.033, lng: 121.5654 },
  BR: { city: "Sao Paulo", lat: -23.5505, lng: -46.6333 },
  MX: { city: "Mexico City", lat: 19.4326, lng: -99.1332 },
  AR: { city: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  CL: { city: "Santiago", lat: -33.4489, lng: -70.6693 },
  CO: { city: "Bogota", lat: 4.711, lng: -74.0721 },
  PE: { city: "Lima", lat: -12.0464, lng: -77.0428 },
};

const KM_PER_DEGREE = 111.32;

function scatter(hub: Hub, maxKm: number): Place {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.sqrt(Math.random()) * maxKm;
  return {
    name: "",
    lat: hub.lat + (distance * Math.cos(angle)) / KM_PER_DEGREE,
    lng: hub.lng + (distance * Math.sin(angle)) / (KM_PER_DEGREE * Math.cos((hub.lat * Math.PI) / 180)),
  };
}

function kmBetween(a: Place, b: Place): number {
  const dLat = (b.lat - a.lat) * KM_PER_DEGREE;
  const dLng = (b.lng - a.lng) * KM_PER_DEGREE * Math.cos((a.lat * Math.PI) / 180);
  return Math.hypot(dLat, dLng);
}

/** Two random points a few kilometres apart inside a country's main city. Names are filled in later. */
export function makeNearbyTrip(code: string): Trip | undefined {
  const hub = hubs[code];
  if (!hub) return undefined;
  const from = scatter(hub, 4);
  let to = scatter(hub, 7);
  while (kmBetween(from, to) < 1.8) to = scatter(hub, 7);
  return { city: hub.city, country: code, generated: true, from: { ...from, name: `Start in ${hub.city}` }, to: { ...to, name: `Stop in ${hub.city}` } };
}
