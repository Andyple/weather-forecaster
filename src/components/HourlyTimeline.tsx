import { HourlyForecast } from '../types'
import './HourlyTimeline.css'

interface HourlyTimelineProps {
  hourly: HourlyForecast[]
  conditions: Record<string, string>
}

function HourlyTimeline({ hourly, conditions }: HourlyTimelineProps) {
  const formatTime = (date: Date): string => {
    const hours = date.getHours()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const h = hours % 12 || 12
    return `${h} ${ampm}`
  }

  return (
    <div className="hourly-timeline">
      {hourly.map((hour, i) => (
        <div key={i} className="hourly-item">
          <div className="hourly-time">{hour.isSunrise ? '🌅 Sunrise' : hour.isSunset ? '🌇 Sunset' : formatTime(hour.time)}</div>
          <div className="hourly-icon">{conditions[hour.condition] || '🌡️'}</div>
          <div className="hourly-temp">{Math.round(hour.temperature)}°</div>
          {hour.precipitationChance > 0 && (
            <div className="hourly-precip">💧{Math.round(hour.precipitationChance)}%</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default HourlyTimeline
