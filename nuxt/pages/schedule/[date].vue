<script setup lang="ts">
import { ChevronLeft, Clock } from 'lucide-vue-next'

const route = useRoute()
const date = computed(() => String(route.params.date))
const isValid = computed(() => /^\d{4}-\d{2}-\d{2}$/.test(date.value))
</script>

<template>
  <div class="detail">
    <NuxtLink to="/schedule" class="detail__back">
      <ChevronLeft :size="18" />
      Back to schedule
    </NuxtLink>

    <div class="card detail__card">
      <span class="detail__icon"><Clock :size="28" /></span>
      <h1>{{ isValid ? formatDate(date) : 'Schedule detail' }}</h1>
      <p>Detail page coming soon</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail {
  padding: 24px 16px;

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 16px;
    color: var(--navy);
    font-size: 0.875rem;
    font-weight: 700;
    text-decoration: none;
  }

  &__card {
    padding: 40px 20px;
    text-align: center;

    h1 {
      margin: 16px 0 6px;
      font-size: 1.3rem;
      font-weight: 800;
    }

    p {
      margin: 0;
      color: var(--text-muted);
    }
  }

  &__icon {
    display: inline-flex;
    padding: 16px;
    border-radius: 50%;
    background: #eef0f4;
    color: var(--navy);
  }
}
</style>