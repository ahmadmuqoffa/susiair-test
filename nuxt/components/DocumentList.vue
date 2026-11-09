<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import type { PilotDocument } from '~/types/api'

const docs = useDocumentsStore()

const sorted = computed(() =>
  [...docs.items].sort((a, b) => a.daysRemaining - b.daysRemaining),
)

function badgeText(d: PilotDocument) {
  if (d.status === 'expired') return 'Expired'
  if (d.status === 'soon') {
    return `${d.daysRemaining} ${d.daysRemaining === 1 ? 'day' : 'days'} left`
  }
  return 'Valid'
}
</script>

<template>
  <section>
    <h2 class="section-title">My Documents</h2>

    <SectionError
      v-if="docs.error && !docs.loaded"
      :message="docs.error"
      @retry="docs.load()"
    />

    <div v-else-if="!docs.loaded" class="doc-skeletons">
      <div v-for="n in 4" :key="n" class="skeleton doc-skeleton" />
    </div>

    <ul v-else class="card doc-list">
      <li v-for="d in sorted" :key="d.id" class="doc">
        <span class="doc__icon"><FileText :size="18" /></span>
        <div class="doc__text">
          <p class="doc__label">{{ d.label }}</p>
          <p class="doc__date">{{ formatDate(d.expiryDate) }}</p>
        </div>
        <span class="badge" :class="`badge--${d.status}`">
          {{ badgeText(d) }}
        </span>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.doc-skeletons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.doc-skeleton {
  height: 56px;
}

.doc-list {
  list-style: none;
  margin: 0;
  padding: 4px 16px;
}

.doc {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;

  & + & {
    border-top: 1px solid #eef0f4;
  }

  &__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #eef0f4;
    color: var(--navy);
  }

  &__text {
    flex: 1;
    min-width: 0;
  }

  &__label {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 700;
  }

  &__date {
    margin: 2px 0 0;
    font-size: 0.75rem;
    color: var(--text-muted);
  }
}

.badge {
  flex-shrink: 0;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;

  &--safe {
    background: rgba(31, 191, 143, 0.12);
    color: #12906b;
  }
  &--soon {
    background: rgba(245, 158, 11, 0.14);
    color: #b45309;
  }
  &--expired {
    background: rgba(230, 55, 87, 0.1);
    color: var(--danger);
  }
}
</style>