import { useState } from 'react'
import { WeatherLocation, StormReport } from '../types'
import { getStormData } from '../services/weatherService'
import './StormPage.css'

const typeIcons: Record<StormReport['type'], string> = {
  lightning: '⚡',
  flashFlood: '🌊',
  severeWind: '🌪️',
}

const severityLabels: Record<StormReport['severity'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

function StormPage() {
  const [location, setLocation] = useState<WeatherLocation | null>(null)
  const [storms, setStorms] = useState<StormReport[]>([])
  const [loading, setLoading] = useState(false)

  const handleSelectLocation = async (loc: WeatherLocation) => {
    setLocation(loc)
    setLoading(true)

    try {
      const data = await getStormData(loc)
      setStorms(data)
    } catch {
      // Error handling placeholder
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="storm-page">
      <div className="page-header">
        <h2>Storm Tracking</h2>
        <p>Monitor nearby storms, lightning, and flood activity</p>
      </div>

      {!location && (
        <div className="location-selector">
          <p className="select-prompt">Select a location to track storms</p>
          <div className="quick-locations">
            {[
              { name: 'Houston', state: 'TX', zipCode: '77001', latitude: 29.7604, longitude: -95.3698, locationId: 1, country: 'USA' },
              { name: 'Dallas', state: 'TX', zipCode: '75201', latitude: 32.7767, longitude: -96.7970, locationId: 2, country: 'USA' },
              { name: 'Austin', state: 'TX', zipCode: '78701', latitude: 30.2672, longitude: -97.7431, locationId: 3, country: 'USA' },
            ].map((loc) => (
              <button
                key={loc.locationId}
                className="quick-loc-btn"
                onClick={() => handleSelectLocation(loc as WeatherLocation)}
              >
                {loc.name}, {loc.state}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      )}

      {location && storms.length === 0 && !loading && (
        <div className="empty-state">
          <p>🌤️ No active storms near {location.name}</p>
        </div>
      )}

      {location && storms.length > 0 && (
        <>
          <div className="forecast-location">
            <h3>Storms near {location.name}, {location.state}</h3>
          </div>
          <div className="storm-list">
            {storms.map((storm, i) => (
              <div key={i} className="storm-card">
                <div className="storm-header">
                  <span className="storm-icon">{typeIcons[storm.type]}</span>
                  <span className={`severity-badge severity-${storm.severity}`}>
                    {severityLabels[storm.severity]}
                  </span>
                </div>
                <div className="storm-details">
                  <div className="storm-detail">
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{storm.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                  <div className="storm-detail">
                    <span className="detail-label">Distance</span>
                    <span className="detail-value">{storm.distance} mi</span>
                  </div>
                  <div className="storm-detail">
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{storm.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default StormPage
