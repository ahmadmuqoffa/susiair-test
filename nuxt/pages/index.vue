<script setup lang="ts">
interface Pilot {
  name: string
  totalFlightHours: number
  avatarUrl: string
}

const api = useApi()
const auth = useAuthStore()

const { data: pilot, error } = await useAsyncData('pilot', () =>
  api<Pilot>('/pilot/me'),
)

async function logout() {
  auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <main style="padding: 24px">
    <h1>Home (placeholder)</h1>
    <p v-if="error">Failed to load pilot profile.</p>
    <p v-else-if="pilot">{{ pilot.name }} · {{ pilot.totalFlightHours }} hrs</p>
    <button @click="logout">Sign out</button>
  </main>
</template>