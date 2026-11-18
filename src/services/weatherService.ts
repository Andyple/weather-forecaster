import { WeatherLocation, WeatherForecast, HourlyForecast, StormReport, HistoricalWeather } from '../types'

const mockLocations: WeatherLocation[] = [
  { locationId: 1, name: 'Houston', latitude: 29.7604, longitude: -95.3698, country: 'USA', state: 'TX', zipCode: '77001' },
  { locationId: 2, name: 'Dallas', latitude: 32.7767, longitude: -96.7970, country: 'USA', state: 'TX', zipCode: '75201' },
  { locationId: 3, name: 'Austin', latitude: 30.2672, longitude: -97.7431, country: 'USA', state: 'TX', zipCode: '78701' },
  { locationId: 4, name: 'San Antonio', latitude: 29.4241, longitude: -98.4936, country: 'USA', state: 'TX', zipCode: '78201' },
  { locationId: 5, name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'USA', state: 'NY', zipCode: '10001' },
]

const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Stormy', 'Thunderstorm', 'Clear']

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

export async function searchLocations(query: string): Promise<WeatherLocation[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!query || query.trim().length === 0) return []

  const q = query.trim().toLowerCase()
  // Try zip code first
  if (/^\d{5}$/.test(q)) {
    const match = mockLocations.find((l) => l.zipCode === q)
    return match ? [match] : []
  }

  // Try partial name match
  return mockLocations.filter(
    (l) => l.name.toLowerCase().includes(q) || l.state.toLowerCase().includes(q) || l.zipCode?.includes(q),
  )
}

export async function getCurrentWeather(location: WeatherLocation): Promise<WeatherForecast> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  return {
    forecastId: Date.now(),
    location,
    forecastDate: new Date(),
    temperatureHigh: randomBetween(60, 95),
    temperatureLow: randomBetween(45, 70),
    condition: randomFrom(conditions),
    humidity: randomBetween(30, 90),
    windSpeed: randomBetween(0, 25),
    precipitationChance: randomBetween(0, 100),
    timestamp: new Date(),
  }
}

export async function getHourlyForecast(): Promise<HourlyForecast[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const now = new Date()
  const hourly: HourlyForecast[] = []

  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 3600000)
    hourly.push({
      time,
      temperature: randomBetween(50, 90),
      condition: randomFrom(conditions),
      precipitationChance: randomBetween(0, 100),
      isSunrise: i === 6,
      isSunset: i === 19,
    })
  }

  return hourly
}

export async function getStormData(location: WeatherLocation): Promise<StormReport[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const reports: StormReport[] = []
  const types: StormReport['type'][] = ['lightning', 'flashFlood', 'severeWind']
  const severities: StormReport['severity'][] = ['low', 'medium', 'high']

  // Generate 0-5 random storm reports near the location
  const count = Math.floor(Math.random() * 6)
  for (let i = 0; i < count; i++) {
    reports.push({
      type: randomFrom(types),
      location: {
        ...location,
        locationId: Date.now() + i,
        name: `${location.name} area`,
        latitude: location.latitude + randomBetween(-2, 2),
        longitude: location.longitude + randomBetween(-2, 2),
      },
      distance: randomBetween(5, 150),
      timestamp: new Date(Date.now() - randomBetween(0, 7200000)),
      severity: randomFrom(severities),
    })
  }

  return reports
}

export async function getHistoricalWeather(
  startDate: Date,
  endDate: Date,
): Promise<HistoricalWeather[]> {
  await new Promise((resolve) => setTimeout(resolve, 700))

  const records: HistoricalWeather[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    records.push({
      date: new Date(current),
      temperatureHigh: randomBetween(50, 95),
      temperatureLow: randomBetween(35, 70),
      condition: randomFrom(conditions),
      humidity: randomBetween(30, 90),
      windSpeed: randomBetween(0, 25),
      precipitation: randomBetween(0, 2),
    })
    current.setDate(current.getDate() + 1)
  }

  return records
}
