<script setup lang="ts">
const schedule = useScheduleStore()

onMounted(() => {
  schedule.load()
})
</script>

<template>
  <div class="page">
    <h1 class="page__title">Schedule</h1>
    <ScheduleCalendar />
    <ScheduleLegend />
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 16px 8px;

  &__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
  }
}
</style>