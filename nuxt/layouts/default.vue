<template>
  <div class="layout">
    <main class="layout__content">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>

<style lang="scss" scoped>
.layout__content {
  padding-bottom: 96px; // ruang supaya konten tidak tertutup navigasi bawah
}
</style>