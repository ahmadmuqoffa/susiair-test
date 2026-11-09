import { defineStore } from 'pinia'
import type { PilotDocument } from '~/types/api'

export const useDocumentsStore = defineStore('documents', () => {
  const api = useApi()

  const items = ref<PilotDocument[]>([])
  const loaded = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      items.value = await api<PilotDocument[]>('/documents')
      loaded.value = true
    } catch {
      error.value = 'Unable to load documents.'
    } finally {
      loading.value = false
    }
  }

  return { items, loaded, loading, error, load }
})