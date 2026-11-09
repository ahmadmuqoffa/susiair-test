<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const schedule = useScheduleStore()
</script>

<template>
  <section v-if="schedule.legend.length" class="card legend">
    <h2 class="section-title">Legend</h2>

    <ul class="legend__list">
      <li v-for="l in schedule.legend" :key="l.code">
        <span class="swatch" :style="{ background: l.color }" />
        <span class="code">{{ l.code }}</span>
        <span class="label">{{ l.label }}</span>
      </li>
    </ul>

    <div class="legend__status">
      <p>
        <span class="mini mini--tick"><Check :size="10" :stroke-width="3.5" /></span>
        All duties logged
      </p>
      <p>
        <span class="mini">2</span>
        Number of duties remaining
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.legend {
  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
    }
  }

  &__status {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #eef0f4;

    p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 8px;
      font-size: 0.78rem;
      color: var(--text-muted);
    }
  }
}

.swatch {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

.code {
  font-weight: 800;
}

.label {
  color: var(--text-muted);
}

.mini {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #eef0f4;
  color: var(--navy);
  font-size: 0.65rem;
  font-weight: 800;

  &--tick {
    color: #12906b;
  }
}
</style>