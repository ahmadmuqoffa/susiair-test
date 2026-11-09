import { defineStore } from 'pinia'
import type { Pilot } from '~/types/api'

export const usePilotStore = defineStore('pilot', () => {
  const api = useApi()

  const profile = ref<Pilot | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    if (profile.value) return
    loading.value = true
    error.value = null
    try {
      profile.value = await api<Pilot>('/pilot/me')
    } catch {
      error.value = 'Unable to load pilot profile.'
    } finally {
      loading.value = false
    }
  }

  return { profile, loading, error, load }
})