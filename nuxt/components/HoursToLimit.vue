<script setup lang="ts">
import type { RangeKey } from '~/types/api'

const hours = useHoursStore()

const RANGES: RangeKey[] = ['1w', '1m', '3m', '6m', '1y']
const selectedIndex = ref(7)

// Setiap data baru datang, pilihan kembali ke "hari ini".
watch(
  () => hours.current,
  (summary) => {
    if (summary) {
      selectedIndex.value = Math.max(
        summary.series.findIndex((p) => p.isToday),
        0,
      )
    }
  },
  { immediate: true },
)

const point = computed(() => hours.current?.series[selectedIndex.value] ?? null)
</script>

<template>
  <section>
    <h2 class="section-title">Hours to Limit</h2>

    <LimitCards :cards="hours.cards" :loading="hours.loading" />

    <div class="card chart-card">
      <div class="toggle" role="group" aria-label="Chart range">
        <button
          v-for="r in RANGES"
          :key="r"
          type="button"
          :class="{ 'is-active': hours.range === r }"
          @click="hours.load(r)"
        >
          {{ r }}
        </button>
      </div>

      <SectionError
        v-if="hours.error && !hours.current"
        :message="hours.error"
        @retry="hours.load(hours.range)"
      />
      <div v-else-if="!hours.current" class="skeleton chart-skeleton" />

      <template v-else>
        <div v-if="point" class="readout">
          <div>
            <p class="readout__label">
              {{ formatDayMonth(point.date) }}
              <template v-if="point.isToday"> · Today</template>
              <template v-else-if="point.isFuture"> · Upcoming</template>
            </p>
            <p class="readout__value">
              {{ formatHours(point.rollingSum) }}
              <span>h in {{ hours.current.windowDays }} days</span>
            </p>
          </div>
          <span v-if="point.overLimit" class="chip">Over limit</span>
        </div>

        <HoursChart
          :series="hours.current.series"
          :limit="hours.current.limit"
          :y-max="hours.current.yMax"
          :selected="selectedIndex"
          @select="selectedIndex = $event"
        />
        <p class="caption">Tap a day for details. Dashed line = upcoming days.</p>
      </template>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.chart-card {
  margin-top: 12px;
}

.toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 14px;
  border-radius: 999px;
  background: #eef0f4;

  button {
    flex: 1;
    padding: 7px 0;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;

    &.is-active {
      background: var(--navy);
      color: #fff;
    }
  }
}

.chart-skeleton {
  height: 230px;
}

.readout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  &__label {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  &__value {
    margin: 2px 0 0;
    font-size: 1.4rem;
    font-weight: 800;

    span {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);
    }
  }
}

.chip {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(230, 55, 87, 0.1);
  color: var(--danger);
  font-size: 0.72rem;
  font-weight: 700;
}

.caption {
  margin: 6px 0 0;
  font-size: 0.7rem;
  color: var(--text-muted);
  text-align: center;
}
</style>