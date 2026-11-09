<script setup lang="ts">
import { House, CalendarDays, BookOpen, Ellipsis } from 'lucide-vue-next'

const route = useRoute()

const items = [
  { label: 'Home', to: '/', icon: House },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Logbook', to: '/logbook', icon: BookOpen },
  { label: 'More', to: '/more', icon: Ellipsis },
]

const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path.startsWith(to)
</script>

<template>
  <nav class="bottom-nav" aria-label="Main navigation">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="bottom-nav__item"
      :class="{ 'is-active': isActive(item.to) }"
    >
      <component :is="item.icon" :size="22" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style lang="scss" scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  background: var(--surface);
  border-top: 1px solid #e8eaef;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 10;

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 0 12px;
    color: var(--text-muted);
    font-size: 0.7rem;
    font-weight: 600;
    text-decoration: none;

    &.is-active {
      color: var(--red);
    }
  }
}
</style>