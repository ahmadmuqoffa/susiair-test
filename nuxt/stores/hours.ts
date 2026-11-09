import { defineStore } from 'pinia'
import type { HoursSummary, LimitCard, RangeKey } from '~/types/api'

export const useHoursStore = defineStore('hours', () => {
  const api = useApi()

  const range = ref<RangeKey>('1w')
  const summaries = ref<Partial<Record<RangeKey, HoursSummary>>>({})
  const cards = ref<LimitCard[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const current = computed(() => summaries.value[range.value] ?? null)

  async function load(next: RangeKey = range.value) {
    range.value = next
    if (summaries.value[next]) return // sudah pernah diambil

    loading.value = true
    error.value = null
    try {
      const res = await api<HoursSummary>('/flight-hours/summary', {
        query: { range: next },
      })
      summaries.value[next] = res
      cards.value = res.cards
    } catch {
      error.value = 'Unable to load flight hours.'
    } finally {
      loading.value = false
    }
  }

  return { range, cards, current, loading, error, load }
})