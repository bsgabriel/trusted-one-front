<template>
  <q-card class="stat-card">
    <q-card-section>
      <div class="row items-center q-mb-sm">
        <q-icon :name="icon" size="24px" :color="color" />
      </div>
      <div class="text-h4 text-weight-bold" :class="`text-${color}`">
        {{ value }}
      </div>
      <div class="text-caption text-grey-7 q-mt-xs">{{ label }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  color: string;
  value: number;
  label: string;
}

defineProps<Props>();
</script>

<style scoped>
.stat-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
