<script setup lang="ts">
import type { LimitCard } from '~/types/api'

defineProps<{ cards: LimitCard[]; loading: boolean }>()

const WINDOW_LABEL: Record<LimitCard['key'], string> = {
  daily: 'Today',
  weekly: 'Last 7 days',
  monthly: 'Last 30 days',
  annual: 'Last 365 days',
}
</script>

<template>
  <div class="limit-grid">
    <template v-if="cards.length">
      <article v-for="c in cards" :key="c.key" class="limit-card">
        <p class="limit-card__label">{{ c.label }}</p>
        <p class="limit-card__value">
          {{ formatHours(c.current) }}<span> / {{ c.limit }} h</span>
        </p>
        <div
          class="bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.min(Math.round(c.percentage), 100)"
        >
          <div
            class="bar__fill"
            :class="`bar__fill--${c.status}`"
            :style="{ width: Math.min(c.percentage, 100) + '%' }"
          />
        </div>
        <p class="limit-card__meta">
          <span>{{ WINDOW_LABEL[c.key] }}</span>
          <span class="pct" :class="`pct--${c.status}`">
            {{ Math.round(c.percentage) }}%
          </span>
        </p>
      </article>
    </template>
    <template v-else-if="loading">
      <div v-for="n in 4" :key="n" class="skeleton limit-skeleton" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.limit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.limit-skeleton {
  height: 118px;
}

.limit-card {
  background: var(--surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 14px;

  &__label {
    margin: 0;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  &__value {
    margin: 6px 0 10px;
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1.1;

    span {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);
    }
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    margin: 8px 0 0;
    font-size: 0.72rem;
    color: var(--text-muted);
  }
}

.bar {
  height: 6px;
  border-radius: 999px;
  background: #eceef2;
  overflow: hidden;

  &__fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.4s ease;

    &--safe {
      background: var(--success);
    }
    &--warning {
      background: var(--warning);
    }
    &--exceeded {
      background: var(--danger);
    }
  }
}

.pct {
  font-weight: 700;

  &--safe {
    color: #12906b;
  }
  &--warning {
    color: #b45309;
  }
  &--exceeded {
    color: var(--danger);
  }
}
</style>