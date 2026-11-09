import { defineStore } from 'pinia'
import type { LegendItem, ScheduleEntry, SchedulesResponse } from '~/types/api'

export const useScheduleStore = defineStore('schedule', () => {
  const api = useApi()
  const config = useRuntimeConfig()

  const [todayYear, todayMonth] = String(config.public.appToday)
    .split('-')
    .map(Number)

  const year = ref(todayYear)
  const month = ref(todayMonth)
  const entries = ref<ScheduleEntry[]>([])
  const legend = ref<LegendItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Penanda request terbaru: respons lama yang datang terlambat diabaikan.
  let latestRequest = 0

  async function load() {
    const id = ++latestRequest
    loading.value = true
    error.value = null
    try {
      const res = await api<SchedulesResponse>('/schedules', {
        query: { year: year.value, month: month.value },
      })
      if (id !== latestRequest) return
      entries.value = res.schedules
      legend.value = res.legend
    } catch {
      if (id !== latestRequest) return
      entries.value = []
      error.value = 'Unable to load schedule.'
    } finally {
      if (id === latestRequest) loading.value = false
    }
  }

  function prevMonth() {
    if (month.value === 1) {
      month.value = 12
      year.value -= 1
    } else {
      month.value -= 1
    }
    return load()
  }

  function nextMonth() {
    if (month.value === 12) {
      month.value = 1
      year.value += 1
    } else {
      month.value += 1
    }
    return load()
  }

  function goToToday() {
    year.value = todayYear
    month.value = todayMonth
    return load()
  }

  return {
    year,
    month,
    entries,
    legend,
    loading,
    error,
    load,
    prevMonth,
    nextMonth,
    goToToday,
  }
})