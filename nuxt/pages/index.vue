<script setup lang="ts">
const pilot = usePilotStore()
const hours = useHoursStore()
const documents = useDocumentsStore()

onMounted(() => {
  pilot.load()
  hours.load()
  documents.load()
})
</script>

<template>
  <div>
    <PilotHeader />
    <div class="home">
      <HoursToLimit />
      <DocumentList />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 16px 8px;
}
</style>