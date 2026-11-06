export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Mode SPA: halaman dirender di browser. Lebih sederhana untuk app
  // yang semua datanya berasal dari API dan butuh login.
  ssr: false,

  modules: ['@pinia/nuxt'],
  css: ['~/assets/scss/main.scss'],

  // Port 3000 sudah dipakai backend NestJS, jadi Nuxt memakai 3001.
  devServer: { port: 3001 },

  runtimeConfig: {
    public: {
      // Bisa diganti lewat environment variable NUXT_PUBLIC_API_BASE.
      apiBase: 'http://localhost:3000',
    },
  },

  app: {
    head: {
      title: 'Susi Air Pilot App',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0E2138' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },
})