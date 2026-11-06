import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // Token disimpan di cookie supaya tetap ada setelah halaman di-refresh.
  const token = useCookie<string | null>('susiair_token', {
    maxAge: 60 * 60 * 24,
    sameSite: 'lax',
  })

  const isLoggedIn = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const config = useRuntimeConfig()
    const res = await $fetch<{ accessToken: string }>('/auth/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { username, password },
    })
    token.value = res.accessToken
  }

  function logout() {
    token.value = null
  }

  return { token, isLoggedIn, login, logout }
})