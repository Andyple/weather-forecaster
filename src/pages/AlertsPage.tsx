import { useState } from 'react'
import { WeatherAlert } from '../types'
import './AlertsPage.css'

const alertTypes = [
  { value: 'temperature_high', label: 'High Temperature', default: 100, unit: '°F' },
  { value: 'temperature_low', label: 'Low Temperature', default: 32, unit: '°F' },
  { value: 'wind_speed', label: 'Wind Speed', default: 40, unit: 'mph' },
  { value: 'precipitation', label: 'Precipitation', default: 0.5, unit: 'in' },
  { value: 'severe_weather', label: 'Severe Weather', default: 0, unit: '' },
]

function AlertsPage() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([
    {
      alertId: 1,
      user: { userId: 1, name: 'Test User', email: 'test@example.com', savedLocations: [], alerts: [] },
      location: { locationId: 1, name: 'Houston', latitude: 29.7604, longitude: -95.3698, country: 'USA', state: 'TX' },
      alertType: 'temperature_high',
      thresholdValue: 100,
      isActive: true,
      createdDate: new Date(),
    },
  ])

  const [newAlert, setNewAlert] = useState({
    type: alertTypes[0].value,
    threshold: alertTypes[0].default.toString(),
  })

  const handleAddAlert = () => {
    const alert: WeatherAlert = {
      alertId: Date.now(),
      user: { userId: 1, name: 'Test User', email: 'test@example.com', savedLocations: [], alerts: [] },
      location: { locationId: 1, name: 'Houston', latitude: 29.7604, longitude: -95.3698, country: 'USA', state: 'TX' },
      alertType: newAlert.type,
      thresholdValue: parseFloat(newAlert.threshold) || 0,
      isActive: true,
      createdDate: new Date(),
    }
    setAlerts([...alerts, alert])
  }

  const handleRemoveAlert = (id: number) => {
    setAlerts(alerts.filter((a) => a.alertId !== id))
  }

  const handleToggle = (id: number) => {
    setAlerts(alerts.map((a) => (a.alertId === id ? { ...a, isActive: !a.isActive } : a)))
  }

  const getTypeLabel = (type: string): string => {
    return alertTypes.find((t) => t.value === type)?.label || type
  }

  const getTypeDefault = (type: string): number => {
    return alertTypes.find((t) => t.value === type)?.default || 0
  }

  const getTypeUnit = (type: string): string => {
    return alertTypes.find((t) => t.value === type)?.unit || ''
  }

  return (
    <div className="alerts-page">
      <div className="page-header">
        <h2>Weather Alerts</h2>
        <p>Set thresholds to get notified about severe weather conditions</p>
      </div>

      {/* Add new alert */}
      <div className="card add-alert">
        <h3>Add New Alert</h3>
        <div className="alert-form">
          <div className="form-group">
            <label>Alert Type</label>
            <select
              value={newAlert.type}
              onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
            >
              {alertTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>
              Threshold ({getTypeUnit(newAlert.type)})
            </label>
            <input
              type="number"
              value={newAlert.threshold}
              onChange={(e) => setNewAlert({ ...newAlert, threshold: e.target.value })}
              placeholder={getTypeDefault(newAlert.type).toString()}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddAlert}>
            Add Alert
          </button>
        </div>
      </div>

      {/* Alert list */}
      <div className="alert-list">
        {alerts.length === 0 && (
          <div className="empty-state">
            <p>🔔 No alerts set. Add one above to get notified.</p>
          </div>
        )}
        {alerts.map((alert) => (
          <div key={alert.alertId} className={`alert-item ${alert.isActive ? '' : 'alert-inactive'}`}>
            <div className="alert-info">
              <div className="alert-type">{getTypeLabel(alert.alertType)}</div>
              <div className="alert-threshold">
                {alert.thresholdValue} {getTypeUnit(alert.alertType)}
              </div>
              <div className="alert-location">{alert.location.name}, {alert.location.state}</div>
            </div>
            <div className="alert-actions">
              <button
                className={`toggle-btn ${alert.isActive ? 'active' : ''}`}
                onClick={() => handleToggle(alert.alertId)}
              >
                {alert.isActive ? 'ON' : 'OFF'}
              </button>
              <button className="remove-btn" onClick={() => handleRemoveAlert(alert.alertId)}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertsPage
