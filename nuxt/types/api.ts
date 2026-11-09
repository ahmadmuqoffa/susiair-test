export type RangeKey = '1w' | '1m' | '3m' | '6m' | '1y'

export interface Pilot {
  name: string
  totalFlightHours: number
  avatarUrl: string
}

export interface LimitCard {
  key: 'daily' | 'weekly' | 'monthly' | 'annual'
  label: string
  windowDays: number
  current: number
  limit: number
  percentage: number
  status: 'safe' | 'warning' | 'exceeded'
}

export interface SeriesPoint {
  date: string
  hours: number
  rollingSum: number
  isToday: boolean
  isFuture: boolean
  overLimit: boolean
}

export interface HoursSummary {
  range: RangeKey
  today: string
  windowDays: number
  limit: number
  yMax: number
  series: SeriesPoint[]
  cards: LimitCard[]
}

export type DocumentStatus = 'safe' | 'soon' | 'expired'

export interface PilotDocument {
  id: string
  label: string
  expiryDate: string
  daysRemaining: number
  status: DocumentStatus
}

export interface LegendItem {
  code: string
  label: string
  color: string
}

export interface ScheduleEntry {
  id: string
  duty_date: string
  status: number
  base_name: string
  base_color: string
  duty_type: string
  count_schedules: number
  count_logbooks: number
}

export interface SchedulesResponse {
  year: number
  month: number
  legend: LegendItem[]
  schedules: ScheduleEntry[]
}