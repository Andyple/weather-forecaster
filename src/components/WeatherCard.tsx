import { WeatherForecast } from '../types'
import './WeatherCard.css'

const conditionIcons: Record<string, string> = {
  Sunny: '☀️',
  'Partly Cloudy': '⛅',
  Cloudy: '☁️',
  Rainy: '🌧️',
  Stormy: '⛈️',
  Thunderstorm: '🌩️',
  Clear: '🌙',
}

function getConditionClass(condition: string): string {
  const map: Record<string, string> = {
    Sunny: 'badge-sunny',
    'Partly Cloudy': 'badge-partly-cloudy',
    Cloudy: 'badge-cloudy',
    Rainy: 'badge-rainy',
    Stormy: 'badge-stormy',
    Thunderstorm: 'badge-stormy',
    Clear: 'badge-clear',
  }
  return map[condition] || 'badge-cloudy'
}

interface WeatherCardProps {
  weather: WeatherForecast
}

function WeatherCard({ weather }: WeatherCardProps) {
  const icon = conditionIcons[weather.condition] || '🌡️'

  return (
    <div className="card weather-card">
      <div className="weather-main">
        <div className="weather-location">
          <h3>{weather.location.name}, {weather.location.state}</h3>
          <span className={`badge ${getConditionClass(weather.condition)}`}>
            {weather.condition}
          </span>
        </div>
        <div className="weather-temp">
          <span className="weather-icon">{icon}</span>
          <span className="temp-high">{Math.round(weather.temperatureHigh)}°F</span>
          <span className="temp-low">{Math.round(weather.temperatureLow)}°F</span>
        </div>
      </div>

      <div className="weather-details">
        <div className="metric">
          <div className="metric-value">{Math.round(weather.humidity)}%</div>
          <div className="metric-label">Humidity</div>
        </div>
        <div className="metric">
          <div className="metric-value">{weather.windSpeed.toFixed(1)}</div>
          <div className="metric-label">Wind (mph)</div>
        </div>
        <div className="metric">
          <div className="metric-value">{Math.round(weather.precipitationChance)}%</div>
          <div className="metric-label">Precipitation</div>
        </div>
      </div>

      <div className="weather-footer">
        <span>Last updated: {weather.timestamp?.toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default WeatherCard
