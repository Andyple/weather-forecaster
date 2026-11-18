import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import SearchPage from './pages/SearchPage'
import ForecastPage from './pages/ForecastPage'
import StormPage from './pages/StormPage'
import AlertsPage from './pages/AlertsPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/search" replace />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="storm" element={<StormPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
