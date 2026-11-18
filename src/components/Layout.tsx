import { Outlet, NavLink } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { path: '/search', label: 'Search', icon: '🔍' },
  { path: '/forecast', label: 'Forecast', icon: '🌤️' },
  { path: '/storm', label: 'Storms', icon: '⛈️' },
  { path: '/alerts', label: 'Alerts', icon: '🔔' },
  { path: '/profile', label: 'Profile', icon: '👤' },
]

function Layout() {
  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1>⛅ Weather</h1>
        </div>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
