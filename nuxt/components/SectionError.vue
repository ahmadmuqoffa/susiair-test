<script setup lang="ts">
import { RotateCw } from 'lucide-vue-next'

defineProps<{ message: string }>()
defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="section-error" role="alert">
    <p>{{ message }}</p>
    <button type="button" @click="$emit('retry')">
      <RotateCw :size="14" />
      Retry
    </button>
  </div>
</template>

<style lang="scss" scoped>
.section-error {
  padding: 16px;
  border-radius: 12px;
  background: rgba(230, 55, 87, 0.08);
  color: var(--danger);
  font-size: 0.875rem;
  font-weight: 500;

  p {
    margin: 0 0 10px;
  }

  button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border: 1px solid var(--danger);
    border-radius: 999px;
    background: transparent;
    color: var(--danger);
    font-weight: 700;
    font-size: 0.8rem;
    cursor: pointer;
  }
}
</style>