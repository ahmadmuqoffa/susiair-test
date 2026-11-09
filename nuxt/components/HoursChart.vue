<script setup lang="ts">
import type { SeriesPoint } from '~/types/api'

const props = defineProps<{
  series: SeriesPoint[]
  limit: number
  yMax: number
  selected: number
}>()
const emit = defineEmits<{ (e: 'select', index: number): void }>()

const W = 340
const H = 210
const PAD = { top: 14, right: 12, bottom: 36, left: 40 }
const innerW = W - PAD.left - PAD.right
const innerH = H - PAD.top - PAD.bottom

const step = computed(() => innerW / Math.max(props.series.length - 1, 1))
const x = (i: number) => PAD.left + i * step.value

// Nilai di luar 0..yMax dijepit supaya tidak keluar dari area chart.
const y = (v: number) => {
  const clamped = Math.min(Math.max(v, 0), props.yMax)
  return PAD.top + innerH - (clamped / props.yMax) * innerH
}

const points = computed(() =>
  props.series.map((p, i) => ({
    ...p,
    cx: x(i),
    cy: y(p.rollingSum),
    day: Number(p.date.slice(8, 10)),
    month: MONTH_SHORT[Number(p.date.slice(5, 7)) - 1],
  })),
)

const todayIndex = computed(() =>
  Math.max(props.series.findIndex((p) => p.isToday), 0),
)

function toPath(pts: { cx: number; cy: number }[]) {
  return pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`)
    .join(' ')
}

const pastPath = computed(() =>
  toPath(points.value.slice(0, todayIndex.value + 1)),
)
const futurePath = computed(() => toPath(points.value.slice(todayIndex.value)))
const areaPath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  const base = y(0)
  return `${toPath(pts)} L ${pts[pts.length - 1].cx} ${base} L ${pts[0].cx} ${base} Z`
})

// Garis bantu sumbu Y dengan langkah "bulat", tanpa menabrak label limit.
function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(raw))
  const f = raw / pow
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10
  return nf * pow
}

const ticks = computed(() => {
  const s = niceStep(props.yMax / 4)
  const list: number[] = []
  for (let v = 0; v <= props.yMax; v += s) {
    if (v === 0 || Math.abs(v - props.limit) > props.yMax * 0.07) list.push(v)
  }
  return list
})

const limitY = computed(() => y(props.limit))
</script>

<template>
  <svg
    class="chart"
    :viewBox="`0 0 ${W} ${H}`"
    role="img"
    aria-label="Rolling flight hours over time"
  >
    <defs>
      <linearGradient id="hours-area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#22C5E8" stop-opacity="0.28" />
        <stop offset="100%" stop-color="#22C5E8" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- Grid dan label sumbu Y -->
    <g v-for="t in ticks" :key="t">
      <line
        class="grid"
        :x1="PAD.left"
        :x2="W - PAD.right"
        :y1="y(t)"
        :y2="y(t)"
      />
      <text class="axis" :x="PAD.left - 6" :y="y(t) + 3" text-anchor="end">
        {{ t }}
      </text>
    </g>

    <path :d="areaPath" fill="url(#hours-area)" />

    <!-- Penanda hari ini -->
    <line
      class="today-line"
      :x1="x(todayIndex)"
      :x2="x(todayIndex)"
      :y1="PAD.top"
      :y2="y(0)"
    />

    <!-- Garis limit merah -->
    <line
      class="limit"
      :x1="PAD.left"
      :x2="W - PAD.right"
      :y1="limitY"
      :y2="limitY"
    />
    <text
      class="limit-label"
      :x="W - PAD.right"
      :y="limitY - 5"
      text-anchor="end"
    >
      Limit {{ limit }} h
    </text>

    <!-- Garis data: solid sampai hari ini, putus-putus untuk hari mendatang -->
    <path class="line" :d="pastPath" />
    <path class="line line--future" :d="futurePath" />

    <circle
      v-for="(p, i) in points"
      :key="p.date"
      :cx="p.cx"
      :cy="p.cy"
      :r="i === selected ? 5.5 : 3.5"
      class="dot"
      :class="{
        'dot--over': p.overLimit,
        'dot--future': p.isFuture,
        'dot--today': p.isToday,
        'dot--selected': i === selected,
      }"
    />

    <!-- Label sumbu X -->
    <g v-for="(p, i) in points" :key="'x-' + p.date">
      <rect
        v-if="p.isToday"
        class="today-pill"
        :x="p.cx - 11"
        :y="H - 32"
        width="22"
        height="16"
        rx="8"
      />
      <text
        :x="p.cx"
        :y="H - 21"
        text-anchor="middle"
        class="x-label"
        :class="{ 'x-label--today': p.isToday }"
      >
        {{ p.day }}
      </text>
      <text
        v-if="i === 0 || p.day === 1"
        :x="p.cx"
        :y="H - 6"
        text-anchor="middle"
        class="x-month"
      >
        {{ p.month }}
      </text>
    </g>

    <!-- Area sentuh (tap) per hari -->
    <rect
      v-for="(p, i) in points"
      :key="'hit-' + p.date"
      class="hit"
      :x="p.cx - step / 2"
      :y="PAD.top"
      :width="step"
      :height="H - PAD.top"
      @click="emit('select', i)"
    />
  </svg>
</template>

<style lang="scss" scoped>
.chart {
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
}

.grid {
  stroke: #e8eaef;
  stroke-width: 1;
}

.axis,
.x-label,
.x-month {
  fill: var(--text-muted);
  font-size: 9px;
  font-weight: 600;
}

.x-month {
  font-size: 8px;
  font-weight: 500;
}

.x-label--today {
  fill: #fff;
  font-weight: 800;
}

.today-pill {
  fill: var(--navy);
}

.today-line {
  stroke: var(--navy);
  stroke-width: 1;
  stroke-dasharray: 3 3;
  opacity: 0.35;
}

.limit {
  stroke: var(--danger);
  stroke-width: 1.5;
}

.limit-label {
  fill: var(--danger);
  font-size: 9px;
  font-weight: 700;
  paint-order: stroke;
  stroke: #fff;
  stroke-width: 3px;
}

.line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;

  &--future {
    stroke-dasharray: 5 5;
  }
}

.dot {
  fill: var(--accent);
  stroke: #fff;
  stroke-width: 1.5;

  &--future {
    fill: #fff;
    stroke: var(--accent);
  }

  &--over {
    fill: var(--danger);
    stroke: #fff;

    &.dot--future {
      fill: #fff;
      stroke: var(--danger);
    }
  }

  &--today,
  &--selected {
    stroke: var(--navy);
    stroke-width: 2;
  }
}

.hit {
  fill: transparent;
  cursor: pointer;
}
</style>