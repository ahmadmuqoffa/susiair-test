<script setup lang="ts">
import { ChevronLeft, ChevronRight, Check } from 'lucide-vue-next'
import type { ScheduleEntry } from '~/types/api'

const schedule = useScheduleStore()
const config = useRuntimeConfig()
const TODAY = String(config.public.appToday)

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const entryByDate = computed(
  () => new Map(schedule.entries.map((e) => [e.duty_date, e])),
)
const labelByCode = computed(
  () => new Map(schedule.legend.map((l) => [l.code, l.label])),
)

const cells = computed(() =>
  buildMonthGrid(schedule.year, schedule.month).map((date) => ({
    date,
    day: date ? Number(date.slice(8, 10)) : null,
    entry: date ? (entryByDate.value.get(date) ?? null) : null,
  })),
)

const isTodayMonth = computed(() =>
  TODAY.startsWith(
    `${schedule.year}-${String(schedule.month).padStart(2, '0')}`,
  ),
)

const remaining = (e: ScheduleEntry) =>
  Math.max(e.count_schedules - e.count_logbooks, 0)

function ariaLabel(date: string, entry: ScheduleEntry | null) {
  if (!entry) return `${formatDate(date)}, no duty`
  const type = labelByCode.value.get(entry.duty_type) ?? entry.duty_type
  const status =
    remaining(entry) === 0
      ? 'all logged'
      : `${remaining(entry)} remaining`
  return `${formatDate(date)}, ${type}, ${status}`
}
</script>

<template>
  <div class="card calendar">
    <div class="calendar__nav">
      <button
        type="button"
        class="nav-btn"
        aria-label="Previous month"
        @click="schedule.prevMonth()"
      >
        <ChevronLeft :size="20" />
      </button>

      <div class="calendar__title">
        <h2>{{ MONTH_LONG[schedule.month - 1] }} {{ schedule.year }}</h2>
        <button
          v-if="!isTodayMonth"
          type="button"
          class="today-btn"
          @click="schedule.goToToday()"
        >
          Back to today
        </button>
      </div>

      <button
        type="button"
        class="nav-btn"
        aria-label="Next month"
        @click="schedule.nextMonth()"
      >
        <ChevronRight :size="20" />
      </button>
    </div>

    <div class="calendar__weekdays">
      <span v-for="w in WEEKDAYS" :key="w">{{ w }}</span>
    </div>

    <SectionError
      v-if="schedule.error"
      :message="schedule.error"
      @retry="schedule.load()"
    />

    <div v-else-if="schedule.loading" class="skeleton calendar__skeleton" />

    <template v-else>
      <div class="calendar__grid">
        <template v-for="(cell, i) in cells" :key="i">
          <div v-if="!cell.date" class="cell cell--empty" />

          <NuxtLink
            v-else
            :to="`/schedule/${cell.date}`"
            class="cell"
            :class="{
              'cell--duty': !!cell.entry,
              'cell--today': cell.date === TODAY,
            }"
            :style="
              cell.entry
                ? {
                    background: cell.entry.base_color,
                    color: readableTextColor(cell.entry.base_color),
                  }
                : undefined
            "
            :aria-label="ariaLabel(cell.date, cell.entry)"
          >
            <span class="cell__day">{{ cell.day }}</span>
            <span v-if="cell.entry" class="cell__code">
              {{ cell.entry.base_name }}
            </span>

            <span v-if="cell.entry" class="cell__badge">
              <Check
                v-if="remaining(cell.entry) === 0"
                :size="11"
                :stroke-width="3.5"
                class="cell__tick"
              />
              <template v-else>{{ remaining(cell.entry) }}</template>
            </span>
          </NuxtLink>
        </template>
      </div>

      <p v-if="!schedule.entries.length" class="calendar__empty">
        No duties scheduled this month.
      </p>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  padding: 16px 12px;

  &__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  &__title {
    text-align: center;

    h2 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 800;
    }
  }

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    margin-bottom: 8px;
    text-align: center;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }

  &__skeleton {
    height: 300px;
  }

  &__empty {
    margin: 14px 0 0;
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-muted);
  }
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: #eef0f4;
  color: var(--navy);
  cursor: pointer;
}

.today-btn {
  margin-top: 2px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--red);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  aspect-ratio: 1 / 1.1;
  border-radius: 10px;
  background: #f8f9fb;
  color: var(--text);
  text-decoration: none;

  &--empty {
    background: transparent;
  }

  &--today {
    box-shadow:
      0 0 0 2px var(--surface),
      0 0 0 4px var(--navy);
  }

  &__day {
    font-size: 0.9rem;
    font-weight: 800;
    line-height: 1;
  }

  &__code {
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    opacity: 0.9;
  }

  &__badge {
    position: absolute;
    top: 3px;
    right: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 15px;
    height: 15px;
    padding: 0 3px;
    border-radius: 999px;
    background: #fff;
    color: var(--navy);
    font-size: 0.6rem;
    font-weight: 800;
    line-height: 1;
    box-shadow: 0 1px 2px rgba(14, 33, 56, 0.2);
  }

  &__tick {
    color: #12906b;
  }
}
</style>