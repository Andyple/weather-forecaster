import { useState } from 'react'
import { SavedLocation, WeatherLocation } from '../types'
import { searchLocations } from '../services/weatherService'
import './ProfilePage.css'

function ProfilePage() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([
    {
      savedLocationId: 1,
      user: { userId: 1, name: 'Test User', email: 'test@example.com', savedLocations: [], alerts: [] },
      location: { locationId: 1, name: 'Houston', latitude: 29.7604, longitude: -95.3698, country: 'USA', state: 'TX', zipCode: '77001' },
      nickname: 'Home',
      dateAdded: new Date('2025-01-15'),
    },
    {
      savedLocationId: 2,
      user: { userId: 1, name: 'Test User', email: 'test@example.com', savedLocations: [], alerts: [] },
      location: { locationId: 5, name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'USA', state: 'NY', zipCode: '10001' },
      nickname: 'Work',
      dateAdded: new Date('2025-02-20'),
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([])
  const [nickname, setNickname] = useState('')

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    const results = await searchLocations(searchQuery)
    setSearchResults(results)
  }

  const handleAddLocation = (location: WeatherLocation) => {
    const newSaved: SavedLocation = {
      savedLocationId: Date.now(),
      user: { userId: 1, name: 'Test User', email: 'test@example.com', savedLocations: [], alerts: [] },
      location,
      nickname: nickname || location.name,
      dateAdded: new Date(),
    }
    setSavedLocations([...savedLocations, newSaved])
    setSearchQuery('')
    setSearchResults([])
    setNickname('')
  }

  const handleRemove = (id: number) => {
    setSavedLocations(savedLocations.filter((s) => s.savedLocationId !== id))
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Profile</h2>
        <p>Manage your saved locations and account settings</p>
      </div>

      {/* User info */}
      <div className="card user-card">
        <div className="user-avatar">TU</div>
        <div className="user-info">
          <h3>Test User</h3>
          <p>test@example.com</p>
        </div>
      </div>

      {/* Add location */}
      <div className="card add-location">
        <h3>Add Saved Location</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search city or ZIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((loc) => (
              <div key={loc.locationId} className="search-result-item">
                <div>
                  <div className="result-name">{loc.name}, {loc.state}</div>
                  <div className="result-zip">ZIP: {loc.zipCode}</div>
                </div>
                <div className="result-actions">
                  <input
                    type="text"
                    placeholder="Nickname (optional)"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="nickname-input"
                  />
                  <button className="btn btn-primary" onClick={() => handleAddLocation(loc)}>
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved locations */}
      <div className="card saved-locations">
        <h3>Saved Locations ({savedLocations.length})</h3>
        {savedLocations.length === 0 ? (
          <div className="empty-state">
            <p>📍 No saved locations yet</p>
          </div>
        ) : (
          <div className="location-list">
            {savedLocations.map((loc) => (
              <div key={loc.savedLocationId} className="saved-location-item">
                <div className="loc-info">
                  <span className="loc-nickname">{loc.nickname}</span>
                  <span className="loc-name">{loc.location.name}, {loc.location.state}</span>
                  <span className="loc-date">Added {loc.dateAdded.toLocaleDateString()}</span>
                </div>
                <button className="remove-btn" onClick={() => handleRemove(loc.savedLocationId)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
