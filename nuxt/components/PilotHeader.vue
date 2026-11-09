<script setup lang="ts">
import { Plane } from 'lucide-vue-next'

const pilot = usePilotStore()
const avatarFailed = ref(false)

const initials = computed(() =>
  (pilot.profile?.name ?? '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
)
</script>

<template>
  <header class="header">
    <div class="header__top">
      <div v-if="pilot.profile">
        <p class="header__greeting">Welcome back,</p>
        <h1 class="header__name">{{ pilot.profile.name }}</h1>
      </div>
      <SectionError
        v-else-if="pilot.error"
        :message="pilot.error"
        @retry="pilot.load()"
      />
      <div v-else class="skeleton header__skeleton" />

      <div v-if="pilot.profile" class="header__avatar">
        <span v-if="avatarFailed">{{ initials }}</span>
        <img
          v-else
          :src="pilot.profile.avatarUrl"
          :alt="pilot.profile.name"
          @error="avatarFailed = true"
        />
      </div>
    </div>

    <div class="header__hours">
      <Plane :size="20" />
      <div>
        <p class="header__hours-label">Total flight hours</p>
        <p v-if="pilot.profile" class="header__hours-value">
          {{ formatHours(pilot.profile.totalFlightHours) }}
          <span>h</span>
        </p>
        <p v-else class="header__hours-value">–</p>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  padding: 28px 20px 24px;
  background: var(--navy);
  color: #fff;
  border-radius: 0 0 24px 24px;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__greeting {
    margin: 0;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }

  &__name {
    margin: 2px 0 0;
    font-size: 1.5rem;
    font-weight: 800;
  }

  &__skeleton {
    width: 160px;
    height: 44px;
    opacity: 0.2;
  }

  &__avatar {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--accent);
    font-weight: 800;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__hours {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    padding: 14px 16px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.08);

    svg {
      color: var(--accent);
    }
  }

  &__hours-label {
    margin: 0;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
  }

  &__hours-value {
    margin: 2px 0 0;
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1.1;

    span {
      font-size: 0.9rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>