import { useState } from 'react'
import { WeatherLocation, WeatherForecast } from '../types'
import { searchLocations, getCurrentWeather } from '../services/weatherService'
import WeatherCard from '../components/WeatherCard'
import './SearchPage.css'

function SearchPage() {
  const [query, setQuery] = useState('')
  const [locations, setLocations] = useState<WeatherLocation[]>([])
  const [weather, setWeather] = useState<WeatherForecast | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setError(null)
    setLoading(true)

    try {
      const results = await searchLocations(query)
      setLocations(results)
    } catch {
      setError('Failed to search locations')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (location: WeatherLocation) => {
    setLocations([])
    setQuery(location.name)
    setError(null)
    setLoading(true)

    try {
      const data = await getCurrentWeather(location)
      setWeather(data)
    } catch {
      setError('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="search-page">
      <div className="page-header">
        <h2>Search Weather</h2>
        <p>Enter a city name, state, or ZIP code to get current conditions</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search city, state, or ZIP..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Search results dropdown */}
      {locations.length > 0 && (
        <div className="location-list">
          {locations.map((loc) => (
            <button
              key={loc.locationId}
              className="location-item"
              onClick={() => handleSelect(loc)}
            >
              <span className="location-name">{loc.name}, {loc.state}</span>
              <span className="location-zip">{loc.zipCode}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && <div className="error-message">{error}</div>}

      {/* Weather display */}
      {weather && <WeatherCard weather={weather} />}

      {/* Empty state */}
      {!weather && !loading && !error && (
        <div className="empty-state">
          <p>🔍 Search for a location to see current weather</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
