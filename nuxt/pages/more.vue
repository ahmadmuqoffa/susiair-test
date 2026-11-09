<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'

const auth = useAuthStore()

async function logout() {
  auth.logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="more">
    <h1>More</h1>
    <button type="button" class="signout" @click="logout">
      <LogOut :size="18" />
      Sign out
    </button>
  </div>
</template>

<style lang="scss" scoped>
.more {
  padding: 24px 16px;
}

.signout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border: 1.5px solid var(--red);
  border-radius: 999px;
  background: transparent;
  color: var(--red);
  font-weight: 700;
  cursor: pointer;
}
</style>