export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (auth.token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }
    },
    async onResponseError({ response }) {
      // Token kedaluwarsa atau tidak valid: paksa login ulang.
      if (response.status === 401 && auth.token) {
        auth.logout()
        await navigateTo('/login')
      }
    },
  })
}